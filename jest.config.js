const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePaths: ["<rootDir>/app"],
  moduleNameMapper: {
    // map it similar to tsconfig.json "@/*": ["./*"]
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  preset: "ts-jest",
};

module.exports = createJestConfig(config)