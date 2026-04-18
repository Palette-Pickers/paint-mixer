module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "^color-name-list/dist/colornames.json$": "<rootDir>/node_modules/color-name-list/dist/colornames.json"
    },
    setupFilesAfterEnv: ['./src/setupTests.ts'],
};
