/**
 * Example Unit Test File
 * 
 * This file demonstrates best practices for writing unit tests:
 * - Proper test organization with describe blocks
 * - Comprehensive test coverage including edge cases
 * - Mocking dependencies
 * - Testing error scenarios
 * - Using custom matchers
 * 
 * Replace these examples with actual tests for your application code.
 */

// ============================================================================
// EXAMPLE: Testing a Pure Function
// ============================================================================

/**
 * Example function to test (normally imported from src/)
 * This would be: import { calculateTotal } from '@/utils/calculations';
 */
const calculateTotal = (items, taxRate = 0.1, discount = 0) => {
  if (!Array.isArray(items)) {
    throw new TypeError('Items must be an array');
  }
  
  if (items.length === 0) {
    return { subtotal: 0, tax: 0, discount: 0, total: 0 };
  }

  const subtotal = items.reduce((sum, item) => {
    if (typeof item.price !== 'number' || typeof item.quantity !== 'number') {
      throw new TypeError('Each item must have numeric price and quantity');
    }
    return sum + item.price * item.quantity;
  }, 0);

  const discountAmount = subtotal * discount;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * taxRate;
  const total = taxableAmount + taxAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(taxAmount * 100) / 100,
    discount: Math.round(discountAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

describe('calculateTotal', () => {
  // Group related tests together
  describe('with valid inputs', () => {
    it('should calculate total for single item', () => {
      // Arrange
      const items = [{ price: 10, quantity: 2 }];
      
      // Act
      const result = calculateTotal(items);
      
      // Assert
      expect(result).toEqual({
        subtotal: 20,
        tax: 2,
        discount: 0,
        total: 22,
      });
    });

    it('should calculate total for multiple items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 },
        { price: 15, quantity: 1 },
      ];
      
      const result = calculateTotal(items);
      
      expect(result.subtotal).toBe(50);
      expect(result.total).toBe(55);
    });

    it('should apply custom tax rate', () => {
      const items = [{ price: 100, quantity: 1 }];
      
      const result = calculateTotal(items, 0.2); // 20% tax
      
      expect(result.tax).toBe(20);
      expect(result.total).toBe(120);
    });

    it('should apply discount before tax', () => {
      const items = [{ price: 100, quantity: 1 }];
      
      const result = calculateTotal(items, 0.1, 0.1); // 10% tax, 10% discount
      
      expect(result.discount).toBe(10);
      expect(result.tax).toBe(9); // Tax on $90
      expect(result.total).toBe(99);
    });

    it('should handle decimal prices correctly', () => {
      const items = [{ price: 19.99, quantity: 3 }];
      
      const result = calculateTotal(items);
      
      expect(result.subtotal).toBe(59.97);
      expect(result.total).toBeCloseTo(65.97, 2);
    });
  });

  describe('with edge cases', () => {
    it('should return zeros for empty array', () => {
      const result = calculateTotal([]);
      
      expect(result).toEqual({
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
      });
    });

    it('should handle zero quantity', () => {
      const items = [{ price: 10, quantity: 0 }];
      
      const result = calculateTotal(items);
      
      expect(result.total).toBe(0);
    });

    it('should handle zero price', () => {
      const items = [{ price: 0, quantity: 5 }];
      
      const result = calculateTotal(items);
      
      expect(result.total).toBe(0);
    });

    it('should handle 100% discount', () => {
      const items = [{ price: 100, quantity: 1 }];
      
      const result = calculateTotal(items, 0.1, 1); // 100% discount
      
      expect(result.total).toBe(0);
    });

    it('should handle very large numbers', () => {
      const items = [{ price: 999999.99, quantity: 1000 }];
      
      const result = calculateTotal(items);
      
      expect(result.subtotal).toBe(999999990);
      expect(result.total).toBeGreaterThan(0);
    });
  });

  describe('with invalid inputs', () => {
    it('should throw TypeError for non-array input', () => {
      expect(() => calculateTotal(null)).toThrow(TypeError);
      expect(() => calculateTotal(undefined)).toThrow(TypeError);
      expect(() => calculateTotal('items')).toThrow(TypeError);
      expect(() => calculateTotal(123)).toThrow(TypeError);
      expect(() => calculateTotal({})).toThrow(TypeError);
    });

    it('should throw TypeError for items without price', () => {
      const items = [{ quantity: 2 }];
      
      expect(() => calculateTotal(items)).toThrow('Each item must have numeric price and quantity');
    });

    it('should throw TypeError for items without quantity', () => {
      const items = [{ price: 10 }];
      
      expect(() => calculateTotal(items)).toThrow('Each item must have numeric price and quantity');
    });

    it('should throw TypeError for non-numeric price', () => {
      const items = [{ price: '10', quantity: 2 }];
      
      expect(() => calculateTotal(items)).toThrow(TypeError);
    });

    it('should throw TypeError for non-numeric quantity', () => {
      const items = [{ price: 10, quantity: '2' }];
      
      expect(() => calculateTotal(items)).toThrow(TypeError);
    });
  });
});

// ============================================================================
// EXAMPLE: Testing a Class
// ============================================================================

/**
 * Example class to test (normally imported from src/)
 */
class UserService {
  constructor(repository) {
    this.repository = repository;
  }

  async createUser(userData) {
    // Validate input
    if (!userData.email || !userData.name) {
      throw new Error('Email and name are required');
    }

    // Check for existing user
    const existing = await this.repository.findByEmail(userData.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // Create user
    const user = await this.repository.create({
      ...userData,
      createdAt: new Date().toISOString(),
    });

    return user;
  }

  async getUserById(id) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

describe('UserService', () => {
  // Mock repository
  let mockRepository;
  let userService;

  beforeEach(() => {
    // Create fresh mocks for each test
    mockRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    };
    userService = new UserService(mockRepository);
  });

  describe('createUser', () => {
    const validUserData = {
      email: 'test@example.com',
      name: 'Test User',
    };

    it('should create a new user successfully', async () => {
      // Arrange
      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue({
        id: '123',
        ...validUserData,
        createdAt: expect.any(String),
      });

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(mockRepository.findByEmail).toHaveBeenCalledWith(validUserData.email);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...validUserData,
        createdAt: expect.any(String),
      });
      expect(result.id).toBe('123');
      expect(result.email).toBe(validUserData.email);
    });

    it('should throw error if email is missing', async () => {
      await expect(
        userService.createUser({ name: 'Test' })
      ).rejects.toThrow('Email and name are required');

      expect(mockRepository.findByEmail).not.toHaveBeenCalled();
    });

    it('should throw error if name is missing', async () => {
      await expect(
        userService.createUser({ email: 'test@example.com' })
      ).rejects.toThrow('Email and name are required');
    });

    it('should throw error if user already exists', async () => {
      mockRepository.findByEmail.mockResolvedValue({ id: 'existing' });

      await expect(
        userService.createUser(validUserData)
      ).rejects.toThrow('User already exists');

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      mockRepository.findByEmail.mockRejectedValue(new Error('Database error'));

      await expect(
        userService.createUser(validUserData)
      ).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '123', name: 'Test', email: 'test@example.com' };
      mockRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById('123');

      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        userService.getUserById('nonexistent')
      ).rejects.toThrow('User not found');
    });
  });
});

// ============================================================================
// EXAMPLE: Testing Async Functions with Timers
// ============================================================================

/**
 * Example async function with retry logic
 */
const fetchWithRetry = async (url, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

describe('fetchWithRetry', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    global.fetch.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return data on successful fetch', async () => {
    const mockData = { success: true };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchWithRetry('https://api.example.com/data');

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and succeed', async () => {
    const mockData = { success: true };
    
    // Fail first two attempts, succeed on third
    global.fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

    const fetchPromise = fetchWithRetry('https://api.example.com/data', 3, 1000);

    // Fast-forward through retries
    await jest.advanceTimersByTimeAsync(1000);
    await jest.advanceTimersByTimeAsync(1000);

    const result = await fetchPromise;

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should throw after max retries exceeded', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const fetchPromise = fetchWithRetry('https://api.example.com/data', 3, 1000);

    // Fast-forward through all retries
    await jest.advanceTimersByTimeAsync(3000);

    await expect(fetchPromise).rejects.toThrow('Network error');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});

// ============================================================================
// EXAMPLE: Using Custom Matchers
// ============================================================================

describe('Custom Matchers', () => {
  describe('toBeValidUUID', () => {
    it('should pass for valid UUID', () => {
      expect('550e8400-e29b-41d4-a716-446655440000').toBeValidUUID();
    });

    it('should fail for invalid UUID', () => {
      expect('not-a-uuid').not.toBeValidUUID();
    });
  });

  describe('toHaveAllKeys', () => {
    it('should pass when object has all keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(obj).toHaveAllKeys(['a', 'b']);
    });

    it('should fail when object is missing keys', () => {
      const obj = { a: 1 };
      expect(obj).not.toHaveAllKeys(['a', 'b', 'c']);
    });
  });
});
