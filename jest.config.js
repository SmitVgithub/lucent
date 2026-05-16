/**
 * Jest Configuration for Lucent Project
 * 
 * This configuration provides:
 * - Comprehensive test coverage reporting
 * - Multiple test environments support
 * - Performance optimizations
 * - Integration with CI/CD pipelines
 * 
 * @see https://jestjs.io/docs/configuration
 */

module.exports = {
  // Display name for this project in test output
  displayName: 'lucent',

  // The root directory for Jest to scan for tests and modules
  rootDir: '.',

  // Directories to search for test files
  roots: ['<rootDir>/tests', '<rootDir>/src'],

  // Test file patterns - supports multiple naming conventions
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Files to ignore during testing
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
    '/.git/',
  ],

  // Module file extensions for importing
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],

  // Transform files before testing (TypeScript/Babel support)
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  // Files to ignore during transformation
  transformIgnorePatterns: [
    '/node_modules/',
    '\\.pnp\\.[^\\/]+$',
  ],

  // Module path aliases (sync with tsconfig.json paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^@helpers/(.*)$': '<rootDir>/tests/helpers/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
    // Handle CSS/SCSS imports in tests
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle image imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },

  // Setup files to run before each test file
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Test environment - use jsdom for browser-like environment
  testEnvironment: 'node',

  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },

  // Coverage configuration
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/types/**/*',
    '!**/node_modules/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'lcov',           // For CI/CD integration
    'html',           // HTML report for local viewing
    'json',           // JSON for programmatic access
    'cobertura',      // For Azure DevOps/Jenkins
  ],

  // Coverage thresholds - fail if below these percentages
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 85,
      lines: 80,
      statements: 80,
    },
    // Per-file thresholds for critical modules
    './src/core/**/*.{js,ts}': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90,
    },
  },

  // Reporters for test results
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './reports/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
    [
      'jest-html-reporter',
      {
        pageTitle: 'Lucent Test Report',
        outputPath: './reports/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
      },
    ],
  ],

  // Global variables available in all tests
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
      diagnostics: {
        warnOnly: true,
      },
    },
  },

  // Timeout for each test (in milliseconds)
  testTimeout: 10000,

  // Verbose output for debugging
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Reset modules between tests for isolation
  resetModules: true,

  // Maximum number of workers for parallel execution
  maxWorkers: '50%',

  // Fail tests on console warnings/errors
  errorOnDeprecated: true,

  // Watch plugins for interactive mode
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // Projects for running different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.[jt]s?(x)'],
      testEnvironment: 'node',
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.[jt]s?(x)'],
      testEnvironment: 'node',
      testTimeout: 30000,
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/tests/e2e/**/*.test.[jt]s?(x)'],
      testEnvironment: 'node',
      testTimeout: 60000,
    },
  ],

  // Snapshot serializers
  snapshotSerializers: [],

  // Cache directory
  cacheDirectory: '<rootDir>/.jest-cache',

  // Force exit after tests complete
  forceExit: true,

  // Detect open handles (async operations not cleaned up)
  detectOpenHandles: true,
};
