/**
 * Jest Test Setup File
 * 
 * This file runs before each test file and sets up:
 * - Global test utilities
 * - Mock configurations
 * - Environment variables for testing
 * - Custom matchers
 * - Global error handlers
 * 
 * @see https://jestjs.io/docs/configuration#setupfilesafterenv-array
 */

// Extend Jest with custom matchers
require('@testing-library/jest-dom');

// ============================================================================
// ENVIRONMENT SETUP
// ============================================================================

/**
 * Set up test environment variables
 * These override any .env values during testing
 */
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent'; // Suppress logs during tests
process.env.API_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test-jwt-secret-do-not-use-in-production';
process.env.AWS_REGION = 'us-east-1';
process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';

// ============================================================================
// GLOBAL MOCKS
// ============================================================================

/**
 * Mock console methods to reduce noise in test output
 * Uncomment specific lines to see those log levels
 */
global.console = {
  ...console,
  // log: jest.fn(),    // Uncomment to suppress console.log
  // debug: jest.fn(),  // Uncomment to suppress console.debug
  // info: jest.fn(),   // Uncomment to suppress console.info
  warn: jest.fn(),      // Suppress warnings by default
  error: jest.fn(),     // Suppress errors by default (we test for them explicitly)
};

/**
 * Mock fetch globally for API tests
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Map(),
  })
);

/**
 * Mock timers for time-dependent tests
 */
jest.useFakeTimers({ advanceTimers: true });

// ============================================================================
// CUSTOM MATCHERS
// ============================================================================

/**
 * Add custom Jest matchers for common assertions
 */
expect.extend({
  /**
   * Check if a value is a valid UUID
   * @param {string} received - The value to check
   */
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid UUID`
          : `expected ${received} to be a valid UUID`,
      pass,
    };
  },

  /**
   * Check if a value is a valid ISO date string
   * @param {string} received - The value to check
   */
  toBeValidISODate(received) {
    const date = new Date(received);
    const pass = !isNaN(date.getTime()) && received === date.toISOString();
    return {
      message: () =>
        pass
          ? `expected ${received} not to be a valid ISO date`
          : `expected ${received} to be a valid ISO date`,
      pass,
    };
  },

  /**
   * Check if an object has all required keys
   * @param {object} received - The object to check
   * @param {string[]} keys - Required keys
   */
  toHaveAllKeys(received, keys) {
    const missingKeys = keys.filter((key) => !(key in received));
    const pass = missingKeys.length === 0;
    return {
      message: () =>
        pass
          ? `expected object not to have keys: ${keys.join(', ')}`
          : `expected object to have keys: ${missingKeys.join(', ')}`,
      pass,
    };
  },

  /**
   * Check if a number is within a percentage of expected value
   * @param {number} received - The actual value
   * @param {number} expected - The expected value
   * @param {number} percentage - Allowed percentage difference
   */
  toBeWithinPercentage(received, expected, percentage) {
    const diff = Math.abs(received - expected);
    const threshold = expected * (percentage / 100);
    const pass = diff <= threshold;
    return {
      message: () =>
        pass
          ? `expected ${received} not to be within ${percentage}% of ${expected}`
          : `expected ${received} to be within ${percentage}% of ${expected}, but difference was ${diff}`,
      pass,
    };
  },

  /**
   * Check if an async function throws a specific error
   * @param {Function} received - The async function to test
   * @param {string|RegExp} expectedError - Expected error message or pattern
   */
  async toThrowErrorMatching(received, expectedError) {
    let thrown = false;
    let error = null;

    try {
      await received();
    } catch (e) {
      thrown = true;
      error = e;
    }

    const pass =
      thrown &&
      (typeof expectedError === 'string'
        ? error.message.includes(expectedError)
        : expectedError.test(error.message));

    return {
      message: () =>
        pass
          ? `expected function not to throw error matching ${expectedError}`
          : thrown
          ? `expected error "${error.message}" to match ${expectedError}`
          : `expected function to throw an error`,
      pass,
    };
  },
});

// ============================================================================
// GLOBAL TEST UTILITIES
// ============================================================================

/**
 * Global test utilities available in all test files
 */
global.testUtils = {
  /**
   * Wait for a specified number of milliseconds
   * @param {number} ms - Milliseconds to wait
   */
  wait: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),

  /**
   * Generate a random string of specified length
   * @param {number} length - Length of string to generate
   */
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  },

  /**
   * Generate a random email address
   */
  randomEmail: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,

  /**
   * Generate a random UUID v4
   */
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },

  /**
   * Create a mock response object for Express-style handlers
   */
  mockResponse: () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.set = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.render = jest.fn().mockReturnValue(res);
    return res;
  },

  /**
   * Create a mock request object for Express-style handlers
   * @param {object} overrides - Properties to override
   */
  mockRequest: (overrides = {}) => ({
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    user: null,
    ...overrides,
  }),

  /**
   * Create a mock next function for Express middleware
   */
  mockNext: () => jest.fn(),
};

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

/**
 * Run before all tests in all files
 */
beforeAll(async () => {
  // Add any global setup here
  // e.g., database connection, server startup
});

/**
 * Run after all tests in all files
 */
afterAll(async () => {
  // Add any global cleanup here
  // e.g., database disconnection, server shutdown
  jest.useRealTimers();
});

/**
 * Run before each test
 */
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  
  // Reset fetch mock
  global.fetch.mockClear();
});

/**
 * Run after each test
 */
afterEach(() => {
  // Clean up any test-specific state
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Handle unhandled promise rejections in tests
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in test:', reason);
});

/**
 * Handle uncaught exceptions in tests
 */
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception in test:', error);
});
