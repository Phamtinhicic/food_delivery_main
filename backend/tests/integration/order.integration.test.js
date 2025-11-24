/**
 * Optimized Order API Integration Tests
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../../server.js');

describe('Order API Integration', () => {
  let userToken, adminToken;

  beforeAll(async () => {
    // Set secret for testing
    process.env.ADMIN_SETUP_SECRET = 'test-secret';
    
    // Create user
    const userRes = await request(app)
      .post('/api/user/register')
      .send({ name: 'Order User', email: `order-${Date.now()}@test.com`, password: 'password123' });
    userToken = userRes.body.token;

    // Create admin
    const adminEmail = `orderadmin-${Date.now()}@test.com`;
    await request(app)
      .post('/api/user/register')
      .send({ name: 'Admin', email: adminEmail, password: 'password123' });

    await request(app)
      .post('/api/user/make-admin')
      .send({ email: adminEmail, secret: 'test-secret' });

    const adminLogin = await request(app)
      .post('/api/user/login')
      .send({ email: adminEmail, password: 'password123' });
    adminToken = adminLogin.body.token;
  });

  test('place order requires authentication', async () => {
    const res = await request(app).post('/api/order/place');

    expect(res.body.success).toBe(false);
  });

  test('user can view their orders', async () => {
    const res = await request(app)
      .post('/api/order/userorders')
      .set('token', userToken);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('admin can list all orders', async () => {
    const res = await request(app)
      .get('/api/order/list')
      .set('token', adminToken);

    expect(res.body.success).toBe(true);
  });

  test('regular user cannot list all orders', async () => {
    const res = await request(app)
      .get('/api/order/list')
      .set('token', userToken);

    expect(res.body.success).toBe(false);
  });
});
