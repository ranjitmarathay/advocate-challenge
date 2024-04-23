/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  testEnvironment: "jsdom",

  // Setup files after environment scripts are run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],  // Make sure to create this file

  // Transform settings to use babel-jest for JSX and ES modules
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },  

  // Module file extensions for importing
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  // Path patterns to ignore when running tests
  testPathIgnorePatterns: ["/node_modules/"],

  // Automatically reset mock states before every test
  resetMocks: true,

  // Use verbose output to get more info about tests
  verbose: true,
};

module.exports = config;
