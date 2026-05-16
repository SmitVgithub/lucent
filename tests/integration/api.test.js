/**
 * Integration Test File for API Endpoints
 * 
 * This file demonstrates best practices for integration testing:
 * - Testing actual HTTP endpoints
 * - Database setup and teardown
 * - Authentication testing
 * - Request/response validation
 * - Error handling scenarios
 * 
 * Replace these examples with actual tests for your API endpoints.
 */

const request = require('supertest');

// ============================================================================
// MOCK APPLICATION SETUP
// ============================================================================

/**
 * Example Express application for testing
 * In real usage, import your actual app:
 * const app = require('@/app');
 */
const express = require('express');

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  // Users endpoints
  const users = new Map();
  let userIdCounter = 1;

  app.get('/api/users', (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const allUsers = Array.from(users.values());
    const paginatedUsers = allUsers.slice(Number(offset), Number(offset) + Number(limit));
    res.json({
      data: paginatedUsers,
      total: allUsers.length,
      limit: Number(limit),
      offset: Number(offset),
    });
  });

  app.get('/api/users/:id', (req, res) => {
    const user = users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });

  app.post('/api/users', (req, res) => {
    const { email, name } = req.body;

    // Validation
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check for duplicate
    const existingUser = Array.from(users.values()).find((u) => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const id = String(userIdCounter++);
    const user = {
      id,
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    users.set(id, user);

    res.status(201).json(user);
  });

  app.put('/api/users/:id', (req, res) => {
    const user = users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name } = req.body;
    if (name) {
      user.name = name;
      user.updatedAt = new Date().toISOString();
    }

    res.json(user);
  });

  app.delete('/api/users/:id', (req, res) => {
    if (!users.has(req.params.id)) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.delete(req.params.id);
    res.status(204).send();
  });

  // Protected endpoint example
  app.get('/api/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.substring(7);
    if (token !== 'valid-token') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json({ message: 'Access granted', user: { id: '1', role: 'admin' } });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Reset function for tests
  app.resetData = () => {
    users.clear();
    userIdCounter = 1;
  };

  return app;
};

// ============================================================================
// TEST SUITE
// ============================================================================

describe('API Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    // Reset data before each test for isolation
    app.resetData();
  });

  // ==========================================================================
  // Health Check Tests
  // ==========================================================================

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body.timestamp).toBeValidISODate();
    });
  });

  // ==========================================================================
  // Users CRUD Tests
  // ==========================================================================

  describe('Users API', () => {
    describe('GET /api/users', () => {
      it('should return empty array when no users exist', async () => {
        const response = await request(app)
          .get('/api/users')
          .expect(200);

        expect(response.body).toEqual({
          data: [],
          total: 0,
          limit: 10,
          offset: 0,
        });
      });

      it('should return all users', async () => {
        // Create test users
        await request(app)
          .post('/api/users')
          .send({ email: 'user1@example.com', name: 'User 1' });
        await request(app)
          .post('/api/users')
          .send({ email: 'user2@example.com', name: 'User 2' });

        const response = await request(app)
          .get('/api/users')
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        expect(response.body.total).toBe(2);
      });

      it('should support pagination', async () => {
        // Create 5 users
        for (let i = 1; i <= 5; i++) {
          await request(app)
            .post('/api/users')
            .send({ email: `user${i}@example.com`, name: `User ${i}` });
        }

        const response = await request(app)
          .get('/api/users')
          .query({ limit: 2, offset: 2 })
          .expect(200);

        expect(response.body.data).toHaveLength(2);
        expect(response.body.total).toBe(5);
        expect(response.body.limit).toBe(2);
        expect(response.body.offset).toBe(2);
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return user by id', async () => {
        // Create a user first
        const createResponse = await request(app)
          .post('/api/users')
          .send({ email: 'test@example.com', name: 'Test User' });

        const userId = createResponse.body.id;

        const response = await request(app)
          .get(`/api/users/${userId}`)
          .expect(200);

        expect(response.body).toMatchObject({
          id: userId,
          email: 'test@example.com',
          name: 'Test User',
        });
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/nonexistent')
          .expect(404);

        expect(response.body).toEqual({ error: 'User not found' });
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const userData = {
          email: 'newuser@example.com',
          name: 'New User',
        };

        const response = await request(app)
          .post('/api/users')
          .send(userData)
          .expect('Content-Type', /json/)
          .expect(201);

        expect(response.body).toMatchObject(userData);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('createdAt');
      });

      it('should return 400 when email is missing', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ name: 'Test User' })
          .expect(400);

        expect(response.body).toEqual({ error: 'Email and name are required' });
      });

      it('should return 400 when name is missing', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ email: 'test@example.com' })
          .expect(400);

        expect(response.body).toEqual({ error: 'Email and name are required' });
      });

      it('should return 400 for invalid email format', async () => {
        const response = await request(app)
          .post('/api/users')
          .send({ email: 'invalid-email', name: 'Test' })
          .expect(400);

        expect(response.body).toEqual({ error: 'Invalid email format' });
      });

      it('should return 409 when user already exists', async () => {
        const userData = {
          email: 'duplicate@example.com',
          name: 'First User',
        };

        // Create first user
        await request(app)
          .post('/api/users')
          .send(userData)
          .expect(201);

        // Try to create duplicate
        const response = await request(app)
          .post('/api/users')
          .send({ ...userData, name: 'Second User' })
          .expect(409);

        expect(response.body).toEqual({ error: 'User already exists' });
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update user name', async () => {
        // Create a user
        const createResponse = await request(app)
          .post('/api/users')
          .send({ email: 'test@example.com', name: 'Original Name' });

        const userId = createResponse.body.id;

        // Update the user
        const response = await request(app)
          .put(`/api/users/${userId}`)
          .send({ name: 'Updated Name' })
          .expect(200);

        expect(response.body.name).toBe('Updated Name');
        expect(response.body).toHaveProperty('updatedAt');
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .put('/api/users/nonexistent')
          .send({ name: 'Updated Name' })
          .expect(404);

        expect(response.body).toEqual({ error: 'User not found' });
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should delete user', async () => {
        // Create a user
        const createResponse = await request(app)
          .post('/api/users')
          .send({ email: 'test@example.com', name: 'Test User' });

        const userId = createResponse.body.id;

        // Delete the user
        await request(app)
          .delete(`/api/users/${userId}`)
          .expect(204);

        // Verify user is deleted
        await request(app)
          .get(`/api/users/${userId}`)
          .expect(404);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .delete('/api/users/nonexistent')
          .expect(404);

        expect(response.body).toEqual({ error: 'User not found' });
      });
    });
  });

  // ==========================================================================
  // Authentication Tests
  // ==========================================================================

  describe('Authentication', () => {
    describe('GET /api/protected', () => {
      it('should return 401 without authorization header', async () => {
        const response = await request(app)
          .get('/api/protected')
          .expect(401);

        expect(response.body).toEqual({ error: 'Unauthorized' });
      });

      it('should return 401 with invalid authorization format', async () => {
        const response = await request(app)
          .get('/api/protected')
          .set('Authorization', 'InvalidFormat token')
          .expect(401);

        expect(response.body).toEqual({ error: 'Unauthorized' });
      });

      it('should return 403 with invalid token', async () => {
        const response = await request(app)
          .get('/api/protected')
          .set('Authorization', 'Bearer invalid-token')
          .expect(403);

        expect(response.body).toEqual({ error: 'Forbidden' });
      });

      it('should return 200 with valid token', async () => {
        const response = await request(app)
          .get('/api/protected')
          .set('Authorization', 'Bearer valid-token')
          .expect(200);

        expect(response.body).toEqual({
          message: 'Access granted',
          user: { id: '1', role: 'admin' },
        });
      });
    });
  });

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });

  // ==========================================================================
  // Performance Tests
  // ==========================================================================

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const start = Date.now();
      
      await request(app)
        .get('/health')
        .expect(200);
      
      const duration = Date.now() - start;
      
      // Response should be under 100ms for health check
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent requests', async () => {
      // Create 10 concurrent requests
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .post('/api/users')
          .send({ email: `concurrent${i}@example.com`, name: `User ${i}` })
      );

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Verify all users were created
      const listResponse = await request(app).get('/api/users');
      expect(listResponse.body.total).toBe(10);
    });
  });
});
