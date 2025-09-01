const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration for React Native
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    ...defaultConfig.transformer,
    // Enable inline requires for better performance
    inlineRequires: true,
  },
  serializer: {
    ...defaultConfig.serializer,
  },
};

module.exports = mergeConfig(defaultConfig, config);
