const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const path = require('path');
const nodeModulesDir = path.resolve(__dirname + '/../../node_modules/');
const validatorDir = path.resolve(__dirname + '/../../packages');
const validatorPackage = '@react-input-validator/';
const config = {
    resolver: {
        extraNodeModules: new Proxy({}, {
            get(_, moduleName) {
                const modulePath = moduleName.startsWith(validatorPackage)
                    ? `${validatorDir}/${moduleName.substring(validatorPackage.length)}`
                    : path.join(nodeModulesDir, moduleName);
                return modulePath;
            }
        }),
    },
    watchFolders: [nodeModulesDir, validatorDir],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
