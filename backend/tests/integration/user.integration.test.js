/**
 * Optimized User API Integration Tests
 * Tests complete HTTP request/response flow
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../../server.js');

describe('User API Integration', () => {
  let userToken, adminToken;
  const testEmail = `test-${Date.now()}@test.com`;
  const adminEmail = `admin-${Date.now()}@test.com`;

  describe('Registration & Login', () => {
    test('registers new user and returns token', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({ name: 'Test User', email: testEmail, password: 'password123' });

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      userToken = res.body.token;
    });

    test('rejects duplicate registration', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({ name: 'Test User', email: testEmail, password: 'password123' });

      expect(res.body.success).toBe(false);
    });

    test('rejects weak password', async () => {
      const res = await request(app)
        .post('/api/user/register')
        .send({ name: 'Test', email: `new${Date.now()}@test.com`, password: 'weak' });

      expect(res.body.success).toBe(false);
    });

    test('logs in with correct credentials', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({ email: testEmail, password: 'password123' });

      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    test('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/user/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Features', () => {
    beforeAll(async () => {
      // Set secret for testing
      process.env.ADMIN_SETUP_SECRET = 'test-secret';
      
      await request(app)
        .post('/api/user/register')
        .send({ name: 'Admin', email: adminEmail, password: 'password123' });

      await request(app)
        .post('/api/user/make-admin')
        .send({ email: adminEmail, secret: 'test-secret' });

      const loginRes = await request(app)
        .post('/api/user/login')
        .send({ email: adminEmail, password: 'password123' });

      adminToken = loginRes.body.token;
    });

    test('rejects make-admin with wrong secret', async () => {
      const res = await request(app)
        .post('/api/user/make-admin')
        .send({ email: testEmail, secret: 'wrong-secret' });

      expect(res.body.success).toBe(false);
    });

    test('admin can list all users', async () => {
      const res = await request(app)
        .get('/api/user/all')
        .set('token', adminToken);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('regular user cannot list all users', async () => {
      const res = await request(app)
        .get('/api/user/all')
        .set('token', userToken);

      expect(res.body.success).toBe(false);
    });
  });
});
