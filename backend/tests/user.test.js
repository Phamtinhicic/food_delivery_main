import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('User API Tests', () => {
  let testUserId;
  let authToken;
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Test123456'
  };

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/FoodDeliveryTest');
    }
  });

  afterAll(async () => {
    // Cleanup: Delete test user if created
    if (testUserId) {
      await mongoose.connection.collection('users').deleteOne({ _id: new mongoose.Types.ObjectId(testUserId) });
    }
    await mongoose.connection.close();
  });

  describe('POST /api/user/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
    });

    it('should fail to register with existing email', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });

    it('should fail to register with invalid email', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'Test123456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail to register with short password', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: 'another@example.com',
          password: '123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/user/login', () => {
    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('token');
      testUserId = response.body.userId;
    });

    it('should fail to login with wrong password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail to login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test123456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail to login without email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          password: 'Test123456'
        })
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/cart/get', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/cart/get')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should get cart data with valid token', async () => {
      const response = await request(app)
        .get('/api/cart/get')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('cartData');
    });
  });
});
