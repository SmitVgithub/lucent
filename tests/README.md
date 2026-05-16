# Test Suite for Lucent

This directory contains the comprehensive test suite for the Lucent project.

## Overview

Since the repository is in its initial state without source code, this test suite provides:

1. **Template test files** - Ready-to-use test templates for common patterns
2. **Test configuration** - Pre-configured testing frameworks
3. **CI/CD integration** - GitHub Actions workflow for automated testing

## Test Structure

```
tests/
├── unit/                 # Unit tests for individual functions/modules
│   └── example.test.js   # Example unit test template
├── integration/          # Integration tests for API/service interactions
│   └── api.test.js       # Example integration test template
├── e2e/                  # End-to-end tests
│   └── app.e2e.test.js   # Example E2E test template
├── fixtures/             # Test data and mocks
│   └── sample-data.json  # Sample test data
├── helpers/              # Test utilities and helpers
│   └── test-utils.js     # Common test utilities
└── README.md             # This file
```

## Running Tests

### Prerequisites

```bash
npm install
```

### Commands

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run E2E tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Writing Tests

### Unit Test Example

```javascript
describe('MyFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### Integration Test Example

```javascript
describe('API Endpoint', () => {
  it('should return 200 for valid request', async () => {
    const response = await request(app).get('/api/resource');
    expect(response.status).toBe(200);
  });
});
```

## Coverage Requirements

- **Minimum coverage**: 80%
- **Branch coverage**: 75%
- **Function coverage**: 85%

## Best Practices

1. **Isolation**: Each test should be independent
2. **Naming**: Use descriptive test names that explain the scenario
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mocking**: Mock external dependencies
5. **Cleanup**: Always clean up after tests

## CI/CD Integration

Tests run automatically on:
- Every push to `main` or `develop` branches
- Every pull request
- Scheduled daily at midnight UTC
