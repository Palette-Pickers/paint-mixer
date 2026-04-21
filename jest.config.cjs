module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: { module: 'CommonJS' },
            diagnostics: { ignoreCodes: [1343] },
        }],
    },
    moduleNameMapper: {
        "\\.(css|scss)$": "<rootDir>/__mocks__/styleMock.js",
        "^color-name-list$": "<rootDir>/__mocks__/color-name-list.js",
        "\\.worker\\.ts$": "<rootDir>/__mocks__/workerMock.js",
    },
    setupFilesAfterEnv: ['./src/setupTests.ts'],
};
