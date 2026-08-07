const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Allow Metro to bundle .cjs files (needed for Firebase)
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== 'cjs'
);
defaultConfig.resolver.sourceExts.push('cjs');

// Tell Metro to prefer the React Native (CJS) build over the browser ESM build
defaultConfig.resolver.unstable_conditionNames = [
  'require',
  'react-native',
  'default',
];

module.exports = defaultConfig;
