/**
 * User API Integration Tests - Simplified
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../server.js');

describe('User API Tests', () => {
  let userToken;
  let adminToken;
  const testUserEmail = `user-${Date.now()}@test.com`;
  const testAdminEmail = `admin-${Date.now()}@test.com`;

  describe('Register', () => {
    test('should register new user', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: testUserEmail,
          password: 'password123'
        });

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      userToken = response.body.token;
    });

    test('should reject duplicate email', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: testUserEmail,
          password: 'password123'
        });

      expect(response.body.success).toBe(false);
    });

    test('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Test User',
          email: `new-${Date.now()}@test.com`,
          password: 'weak'
        });

      expect(response.body.success).toBe(false);
    });
  });

  describe('Login', () => {
    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUserEmail,
          password: 'password123'
        });

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    test('should reject wrong password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: testUserEmail,
          password: 'wrongpassword'
        });

      expect(response.body.success).toBe(false);
    });
  });

  describe('Admin Features', () => {
    beforeAll(async () => {
      // Create admin
      await request(app)
        .post('/api/user/register')
        .send({
          name: 'Admin',
          email: testAdminEmail,
          password: 'password123'
        });

      await request(app)
        .post('/api/user/make-admin')
        .send({
          email: testAdminEmail,
          secret: process.env.ADMIN_SETUP_SECRET || 'test-secret'
        });

      const loginResponse = await request(app)
        .post('/api/user/login')
        .send({
          email: testAdminEmail,
          password: 'password123'
        });

      adminToken = loginResponse.body.token;
    });

    test('should reject make-admin without valid secret', async () => {
      const newEmail = `admin2-${Date.now()}@test.com`;
      await request(app)
        .post('/api/user/register')
        .send({
          name: 'New Admin',
          email: newEmail,
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/user/make-admin')
        .send({
          email: newEmail,
          secret: 'wrong-secret'
        });

      expect(response.body.success).toBe(false);
    });

    test('admin can list users', async () => {
      const response = await request(app)
        .get('/api/user/all')
        .set('token', adminToken);

      expect(response.status).toBe(200);
    });

    test('user cannot list users', async () => {
      const response = await request(app)
        .get('/api/user/all')
        .set('token', userToken);

      expect(response.body.success).toBe(false);
    });
  });
});
