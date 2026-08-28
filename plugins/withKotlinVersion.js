const { withAndroidBuildGradle } = require('@expo/config-plugins');

/**
 * Custom config plugin to force Kotlin 2.1.21 in android/build.gradle.
 * expo-modules-core 3.x requires Kotlin 2.0+ but Expo SDK 54 generates 1.9.25.
 */
module.exports = function withKotlinVersion(config, { kotlinVersion = '2.1.21' } = {}) {
  return withAndroidBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    // Replace kotlinVersion in ext block
    contents = contents.replace(
      /kotlinVersion\s*=\s*["'][^"']+["']/g,
      `kotlinVersion = "${kotlinVersion}"`
    );

    // Replace direct classpath references
    contents = contents.replace(
      /org\.jetbrains\.kotlin:kotlin-gradle-plugin:[0-9.]+/g,
      `org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}`
    );

    config.modResults.contents = contents;
    return config;
  });
};
