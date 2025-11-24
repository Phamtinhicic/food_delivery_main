/**
 * Optimized Food API Integration Tests
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../../server.js');

describe('Food API Integration', () => {
  let adminToken, userToken;

  beforeAll(async () => {
    // Set secret for testing
    process.env.ADMIN_SETUP_SECRET = 'test-secret';
    
    // Create admin
    const adminEmail = `admin-${Date.now()}@test.com`;
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

    // Create regular user
    const userRes = await request(app)
      .post('/api/user/register')
      .send({ name: 'User', email: `user-${Date.now()}@test.com`, password: 'password123' });
    userToken = userRes.body.token;
  });

  test('lists foods without authentication', async () => {
    const res = await request(app).get('/api/food/list');

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('add food requires authentication', async () => {
    const res = await request(app).post('/api/food/add');

    expect(res.body.success).toBe(false);
  });

  test('regular user cannot remove food', async () => {
    const res = await request(app)
      .post('/api/food/remove')
      .set('token', userToken)
      .send({ id: 'fake-id' });

    expect(res.body.success).toBe(false);
  });
});
