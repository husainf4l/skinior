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
  server: {
    ...defaultConfig.server,
    // Allow connections from any device for debugging
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Add CORS headers to allow connections
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return middleware(req, res, next);
      };
    },
  },
  resolver: {
    ...defaultConfig.resolver,
    // Add platform-specific extensions
    platforms: ['ios', 'android'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
