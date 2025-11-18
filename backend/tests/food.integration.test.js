/**
 * Food API Integration Tests - Simplified
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../server.js');

describe('Food API Tests', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
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

    // Create user
    const userResponse = await request(app)
      .post('/api/user/register')
      .send({
        name: 'User',
        email: `user-${Date.now()}@test.com`,
        password: 'password123'
      });
    userToken = userResponse.body.token;
  });

  describe('List Foods', () => {
    test('should work without authentication', async () => {
      const response = await request(app)
        .get('/api/food/list');

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('Add Food', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/add');

      expect(response.body.success).toBe(false);
    });
  });

  describe('Remove Food', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/remove');

      expect(response.body.success).toBe(false);
    });

    test('user cannot remove food', async () => {
      const response = await request(app)
        .post('/api/food/remove')
        .set('token', userToken)
        .send({ id: 'test-id' });

      expect(response.body.success).toBe(false);
    });

    test('admin can attempt remove', async () => {
      const response = await request(app)
        .post('/api/food/remove')
        .set('token', adminToken)
        .send({ id: 'nonexistent' });

      expect(response.status).toBe(200);
    });
  });
});
