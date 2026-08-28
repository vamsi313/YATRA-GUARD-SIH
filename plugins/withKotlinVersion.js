const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Custom config plugin to force Kotlin 2.1.21 in android/build.gradle.
 * expo-modules-core 3.x requires Kotlin 2.0+ but Expo SDK 54's version catalog pins 1.9.25.
 * We inject the version explicitly into the classpath to override the version catalog.
 */
module.exports = function withKotlinVersion(config, { kotlinVersion = '2.1.21' } = {}) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Case 1: classpath with NO version (version catalog resolves it) - add explicit version
    contents = contents.replace(
      /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin['"]\)/g,
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')`
    );

    // Case 2: classpath WITH a version - replace the version
    contents = contents.replace(
      /classpath\(['"]org\.jetbrains\.kotlin:kotlin-gradle-plugin:[0-9.]+['"]\)/g,
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}')`
    );

    // Case 3: kotlinVersion in ext block
    contents = contents.replace(
      /kotlinVersion\s*=\s*["'][^"']+["']/g,
      `kotlinVersion = "${kotlinVersion}"`
    );

    config.modResults.contents = contents;
    return config;
  });
};
