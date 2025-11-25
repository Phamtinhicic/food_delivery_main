/**
 * Optimized Cart API Integration Tests
 */

import request from 'supertest';
import { describe, test, expect, beforeAll } from '@jest/globals';

const { default: app } = await import('../../server.js');

describe('Cart API Integration', () => {
  let userToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ name: 'Cart User', email: `cart-${Date.now()}@test.com`, password: 'password123' });
    userToken = res.body.token;
  });

  test('requires authentication', async () => {
    const res = await request(app).post('/api/cart/add');

    expect(res.body.success).toBe(false);
  });

  test('adds item to cart', async () => {
    const res = await request(app)
      .post('/api/cart/add')
      .set('token', userToken)
      .send({ itemId: 'food123' });

    expect(res.body.success).toBe(true);
  });

  test('gets cart data', async () => {
    const res = await request(app)
      .post('/api/cart/get')
      .set('token', userToken);

    expect(res.body.success).toBe(true);
    expect(res.body.cartData).toBeDefined();
  });

  test('removes item from cart', async () => {
    const res = await request(app)
      .post('/api/cart/remove')
      .set('token', userToken)
      .send({ itemId: 'food123' });

    expect(res.body.success).toBe(true);
  });
});
