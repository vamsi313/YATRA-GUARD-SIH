const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Custom config plugin to force Kotlin 2.0.21 in android/build.gradle.
 * React Native 0.76 requires Kotlin 2.0.x (2.1+ breaks KotlinTopLevelExtension).
 * Kotlin 2.0.21 is fully supported by Expo 54 KSP matrix.
 */
module.exports = function withKotlinVersion(config, { kotlinVersion = '2.0.21' } = {}) {
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
