const { withProjectBuildGradle, withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Custom config plugin:
 * 1. Forces Kotlin 2.0.21 in android/build.gradle.
 * 2. Removes 'enableBundleCompression' from android/app/build.gradle for React Native 0.76 compatibility.
 */
module.exports = function withBuildFixes(config, { kotlinVersion = '2.0.21' } = {}) {
  // 1. Patch root build.gradle
  config = withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    contents = contents.replace(
      /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin['"]\)/g,
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')`
    );

    contents = contents.replace(
      /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin:[0-9.]+['"]\)/g,
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')`
    );

    contents = contents.replace(
      /kotlinVersion\s*=\s*["'][^"']+["']/g,
      `kotlinVersion = "${kotlinVersion}"`
    );

    config.modResults.contents = contents;
    return config;
  });

  // 2. Patch app/build.gradle (Remove enableBundleCompression property unknown to RN 0.76)
  config = withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    contents = contents.replace(/.*enableBundleCompression.*/g, '');

    config.modResults.contents = contents;
    return config;
  });

  return config;
};
