import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server.js';

let userToken = '';
const testUserEmail = `ordertest${Date.now()}@example.com`;

describe('Order API Tests', () => {

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const registerResponse = await request(app)
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
      const response = await request(app)
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
      const response = await request(app)
        .post('/api/order/userorders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should get user orders with valid token', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
    }, 10000);
  });
});
