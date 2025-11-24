/**
 * Order API Integration Tests - Simplified
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../server.js');

describe('Order API Tests', () => {
  let userToken;
  let adminToken;

  beforeAll(async () => {
    // Create user
    const userResponse = await request(app)
      .post('/api/user/register')
      .send({
        name: 'User',
        email: `user-${Date.now()}@test.com`,
        password: 'password123'
      });
    userToken = userResponse.body.token;

    // Create admin
    const adminEmail = `admin-${Date.now()}@test.com`;
    await request(app)
      .post('/api/user/register')
      .send({
        name: 'Admin',
        email: adminEmail,
        password: 'password123'
      });

    await request(app)
      .post('/api/user/make-admin')
      .send({
        email: adminEmail,
        secret: process.env.ADMIN_SETUP_SECRET || 'test-secret'
      });

    const adminLogin = await request(app)
      .post('/api/user/login')
      .send({
        email: adminEmail,
        password: 'password123'
      });
    adminToken = adminLogin.body.token;
  });

  describe('Place Order', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .send({
          items: [{ name: 'Pizza', price: 10, quantity: 1 }],
          amount: 10,
          address: {}
        });

      expect(response.body.success).toBe(false);
    });
  });

  describe('Verify Order', () => {
    test('should handle verification', async () => {
      const response = await request(app)
        .post('/api/order/verify')
        .send({
          success: 'false',
          orderId: 'test123'
        });

      expect(response.body.success).toBe(false);
    });
  });

  describe('User Orders', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/userorders');

      expect(response.body.success).toBe(false);
    });

    test('should get user orders', async () => {
      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', userToken);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('List Orders (Admin)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/order/list');

      expect(response.body.success).toBe(false);
    });

    test('user cannot list all orders', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .set('token', userToken);

      expect(response.body.success).toBe(false);
    });

    test('admin can list orders', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .set('token', adminToken);

      expect(response.status).toBe(200);
    });
  });

  describe('Update Status (Admin)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .send({ orderId: 'test', status: 'Processing' });

      expect(response.body.success).toBe(false);
    });

    test('user cannot update status', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .set('token', userToken)
        .send({ orderId: 'test', status: 'Processing' });

      expect(response.body.success).toBe(false);
    });
  });
});
