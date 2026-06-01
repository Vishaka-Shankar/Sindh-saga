const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Increase memory limits for bundling
config.maxWorkers = 2;
config.resetCache = true;

// Optimize resolver
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

// Optimize transformer
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
