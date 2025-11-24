/**
 * Cart API Integration Tests - Simplified
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../server.js');

describe('Cart API Tests', () => {
  let userToken;
  const testEmail = `cart-${Date.now()}@test.com`;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Cart User',
        email: testEmail,
        password: 'password123'
      });
    userToken = response.body.token;
  });

  describe('Add to Cart', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({ itemId: 'food123' });

      expect(response.body.success).toBe(false);
    });

    test('should add item to cart', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: 'food123' });

      expect(response.body.success).toBe(true);
    });

    test('should increment quantity for same item', async () => {
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: 'food456' });

      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: 'food456' });

      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(cartResponse.body.cartData.food456).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Get Cart', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/get');

      expect(response.body.success).toBe(false);
    });

    test('should get cart data', async () => {
      const response = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(response.body.success).toBe(true);
      expect(response.body.cartData).toBeDefined();
    });
  });

  describe('Remove from Cart', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/remove')
        .send({ itemId: 'food123' });

      expect(response.body.success).toBe(false);
    });

    test('should remove item from cart', async () => {
      // Add item first
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: 'remove-test' });

      // Remove it
      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', userToken)
        .send({ itemId: 'remove-test' });

      expect(response.body.success).toBe(true);
    });
  });
});
