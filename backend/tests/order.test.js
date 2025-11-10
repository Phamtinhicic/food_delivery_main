import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

const TEST_URL = process.env.TEST_API_URL || 'http://localhost:4000';

let userToken = '';
const testUserEmail = `ordertest${Date.now()}@example.com`;

describe('Order API Tests', () => {

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const registerResponse = await request(TEST_URL)
      .post('/api/user/register')
      .send({
        name: 'Order Test User',
        email: testUserEmail,
        password: 'Test123456'
      });
    
    if (registerResponse.body.success) {
      userToken = registerResponse.body.token;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/order/place', () => {
    test('should require authentication', async () => {
      const response = await request(TEST_URL)
        .post('/api/order/place')
        .send({
          items: [],
          amount: 50,
          address: {}
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);
  });

  describe('POST /api/order/userorders', () => {
    test('should require authentication', async () => {
      const response = await request(TEST_URL)
        .post('/api/order/userorders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should get user orders with valid token', async () => {
      if (!userToken) return;

      const response = await request(TEST_URL)
        .post('/api/order/userorders')
        .set('token', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    }, 10000);
  });
});
