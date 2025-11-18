/**
 * Integration Tests for User API
 * E2E tests with real database and HTTP requests
 */

import request from 'supertest';
import { jest } from '@jest/globals';

// Import server
const { default: app } = await import('../server.js');

describe('User API - Integration Tests', () => {
  // Test data
  const testUser = {
    name: 'Integration Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'password123'
  };

  const testAdmin = {
    name: 'Admin User',
    email: `admin-${Date.now()}@example.com`,
    password: 'adminpass123'
  };

  let userToken;
  let adminToken;
  let adminUserId;

  describe('POST /api/user/register', () => {
    test('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.role).toBe('user');
      
      userToken = response.body.token;
    });

    test('should reject duplicate email registration', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists');
    });

    test('should reject invalid email format', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please enter valid email');
    });

    test('should reject weak password (< 8 characters)', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test',
          email: 'newuser@example.com',
          password: 'weak'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Please enter strong password');
    });

    test('should reject missing required fields', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/user/login', () => {
    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.role).toBe('user');
    });

    test('should reject wrong password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid Credentials');
    });

    test('should reject non-existent email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User Doesn't exist");
    });

    test('should reject missing email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should reject missing password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/user/makeAdmin', () => {
    test('should make user admin with correct secret', async () => {
      // First register the admin user
      const registerResponse = await request(app)
        .post('/api/user/register')
        .send(testAdmin);

      adminUserId = registerResponse.body.userId;

      // Then make them admin
      const response = await request(app)
        .post('/api/user/makeAdmin')
        .send({
          email: testAdmin.email,
          secret: process.env.ADMIN_SETUP_SECRET || 'test-secret'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('is now admin');

      // Verify by logging in
      const loginResponse = await request(app)
        .post('/api/user/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password
        });

      expect(loginResponse.body.role).toBe('admin');
      adminToken = loginResponse.body.token;
    });

    test('should reject with wrong secret', async () => {
      const response = await request(app)
        .post('/api/user/makeAdmin')
        .send({
          email: testAdmin.email,
          secret: 'wrong-secret'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized');
    });

    test('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/user/makeAdmin')
        .send({
          email: 'nonexistent@example.com',
          secret: process.env.ADMIN_SETUP_SECRET || 'test-secret'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('POST /api/user/create (Admin Only)', () => {
    test('should allow admin to create new user', async () => {
      const response = await request(app)
        .post('/api/user/create')
        .set('token', adminToken)
        .send({
          name: 'Created by Admin',
          email: `created-${Date.now()}@example.com`,
          password: 'password123',
          role: 'restaurant'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User created');
    });

    test('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/user/create')
        .set('token', userToken)
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/user/create')
        .send({
          name: 'Test',
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/user/list (Admin Only)', () => {
    test('should allow admin to list all users', async () => {
      const response = await request(app)
        .get('/api/user/list')
        .set('token', adminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Check that passwords are not included
      response.body.data.forEach(user => {
        expect(user.password).toBeUndefined();
      });
    });

    test('should reject non-admin users', async () => {
      const response = await request(app)
        .get('/api/user/list')
        .set('token', userToken)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/user/list')
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/user/delete (Admin Only)', () => {
    let userToDeleteId;

    beforeAll(async () => {
      // Create a user to delete
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'To Be Deleted',
          email: `delete-${Date.now()}@example.com`,
          password: 'password123'
        });

      // Extract user ID from token (you may need to decode JWT)
      // For now, we'll use the list endpoint to get the ID
      const listResponse = await request(app)
        .get('/api/user/list')
        .set('token', adminToken);

      const user = listResponse.body.data.find(u => u.name === 'To Be Deleted');
      userToDeleteId = user._id;
    });

    test('should allow admin to delete user', async () => {
      const response = await request(app)
        .delete('/api/user/delete')
        .set('token', adminToken)
        .send({ id: userToDeleteId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted');
    });

    test('should reject non-admin users', async () => {
      const response = await request(app)
        .delete('/api/user/delete')
        .set('token', userToken)
        .send({ id: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/user/delete')
        .send({ id: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('User Authentication Flow', () => {
    test('should complete full registration -> login -> authenticated request flow', async () => {
      const uniqueUser = {
        name: 'Flow Test User',
        email: `flow-${Date.now()}@example.com`,
        password: 'password123'
      };

      // Step 1: Register
      const registerResponse = await request(app)
        .post('/api/user/register')
        .send(uniqueUser);

      expect(registerResponse.body.success).toBe(true);
      const regToken = registerResponse.body.token;

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/user/login')
        .send({
          email: uniqueUser.email,
          password: uniqueUser.password
        });

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.token).toBeDefined();

      // Step 3: Use token for authenticated request (cart operations)
      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', regToken);

      expect(cartResponse.body.success).toBe(true);
    });
  });
});
