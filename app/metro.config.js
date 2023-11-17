const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { resolve } = require("path");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  // options for reading data outside root react-native folder
  projectRoot: __dirname,
  watchFolders: [resolve(__dirname, '../common/')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
