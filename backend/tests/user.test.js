import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

// Test server URL - will use environment variable or local
const TEST_URL = process.env.TEST_API_URL || 'http://localhost:4000';

// Store test data
let testUserToken = '';
let testUserId = '';
const testUserEmail = `test${Date.now()}@example.com`;

describe('User API Tests', () => {
  
  // Connect to test database before all tests
  beforeAll(async () => {
    // Wait a bit for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  // Clean up after all tests
  afterAll(async () => {
    // Close mongoose connection if any
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/user/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: testUserEmail,
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      
      // Store token for later tests
      testUserToken = response.body.token;
    }, 10000);

    test('should fail to register with existing email', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/register')
        .send({
          name: 'Test User 2',
          email: testUserEmail, // Same email as above
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    }, 10000);

    test('should fail to register with invalid email', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
    }, 10000);

    test('should fail to register with missing fields', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          // Missing email and password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
    }, 10000);
  });

  describe('POST /api/user/login', () => {
    test('should login successfully with correct credentials', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/login')
        .send({
          email: testUserEmail,
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
    }, 10000);

    test('should fail to login with wrong password', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/login')
        .send({
          email: testUserEmail,
          password: 'WrongPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Invalid credentials');
    }, 10000);

    test('should fail to login with non-existent email', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
    }, 10000);

    test('should fail to login without email', async () => {
      const response = await request(TEST_URL)
        .post('/api/user/login')
        .send({
          password: 'Test123456'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
    }, 10000);
  });

  describe('Cart API', () => {
    test('POST /api/cart/add - should require authentication', async () => {
      const response = await request(TEST_URL)
        .post('/api/cart/add')
        .send({
          itemId: 'test-food-id'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('POST /api/cart/add - should add item to cart with valid token', async () => {
      const response = await request(TEST_URL)
        .post('/api/cart/add')
        .set('token', testUserToken)
        .send({
          itemId: 'test-food-id'
        });

      // Will fail if no food exists, but should authenticate properly
      expect(response.status).toBe(200);
      // Either success or failure message, but not auth error
      expect(response.body.message).not.toContain('Login Again');
    }, 10000);

    test('GET /api/cart/get - should get cart data with valid token', async () => {
      const response = await request(TEST_URL)
        .post('/api/cart/get')
        .set('token', testUserToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('cartData');
    }, 10000);
  });
});
