module.exports = {
    testEnvironment: "jsdom",
    testMatch: [
        "**/__tests__/Context.test.js"
    ],
    transformIgnorePatterns: [
        "node_modules/(?!(javascript-common|@react-native|react-native|reactjs-common)/)"
    ],
};