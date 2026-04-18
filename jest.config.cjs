module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "^color-name-list$": "<rootDir>/__mocks__/color-name-list.js"
    },
    setupFilesAfterEnv: ['./src/setupTests.ts'],
};
