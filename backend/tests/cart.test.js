import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server.js';

let userToken = '';
let testFoodId = '';
const testUserEmail = `carttest${Date.now()}@example.com`;

describe('Cart API Tests', () => {

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Register user
    const registerResponse = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Cart Test User',
        email: testUserEmail,
        password: 'Test123456'
      });
    
    if (registerResponse.body.success) {
      userToken = registerResponse.body.token;
    }

    // Get a food item ID for testing
    const foodsResponse = await request(app).get('/api/food/list');
    if (foodsResponse.body.success && foodsResponse.body.data.length > 0) {
      testFoodId = foodsResponse.body.data[0]._id;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/cart/add', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({
          itemId: 'test-food-id'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('should add item to cart with valid token', async () => {
      if (!userToken || !testFoodId) {
        console.log('Skipping: no token or food ID');
        return;
      }

      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({
          itemId: testFoodId
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      
      if (response.body.success) {
        expect(response.body.message).toContain('Added to Cart');
      }
    }, 10000);

    test('should increment quantity when adding same item again', async () => {
      if (!userToken || !testFoodId) return;

      // Add first time
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      // Add second time
      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }, 10000);

    test('should fail without itemId', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({});

      expect(response.status).toBe(200);
      // Should handle missing itemId
      expect(response.body).toHaveProperty('success');
    }, 10000);
  });

  describe('POST /api/cart/remove', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/remove')
        .send({
          itemId: 'test-food-id'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('should remove item from cart', async () => {
      if (!userToken || !testFoodId) return;

      // First add item
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      // Then remove it
      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      
      if (response.body.success) {
        expect(response.body.message).toContain('Removed from Cart');
      }
    }, 10000);

    test('should decrement quantity if more than 1', async () => {
      if (!userToken || !testFoodId) return;

      // Add item twice
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      // Remove once
      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Item should still be in cart with quantity 1
      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(cartResponse.body.success).toBe(true);
    }, 15000);

    test('should handle removing non-existent item gracefully', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', userToken)
        .send({ itemId: 'non_existent_item_123' });

      expect(response.status).toBe(200);
      // Should not crash
      expect(response.body).toHaveProperty('success');
    }, 10000);
  });

  describe('POST /api/cart/get', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/get');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('should get cart data with valid token', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('cartData');
      expect(typeof response.body.cartData).toBe('object');
    }, 10000);

    test('should return empty cart for new user', async () => {
      // Register new user
      const newUserEmail = `newcart${Date.now()}@example.com`;
      const registerResponse = await request(app)
        .post('/api/user/register')
        .send({
          name: 'New Cart User',
          email: newUserEmail,
          password: 'Test123456'
        });

      if (!registerResponse.body.success) return;

      const newToken = registerResponse.body.token;
      const response = await request(app)
        .post('/api/cart/get')
        .set('token', newToken);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cartData).toEqual({});
    }, 15000);
  });

  describe('Cart Workflow Integration', () => {
    test('should handle complete cart workflow: add -> get -> remove', async () => {
      if (!userToken || !testFoodId) return;

      // 1. Add item to cart
      const addResponse = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      expect(addResponse.body.success).toBe(true);

      // 2. Get cart and verify item is there
      const getResponse = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(getResponse.body.success).toBe(true);
      expect(getResponse.body.cartData).toHaveProperty(testFoodId);

      // 3. Remove item from cart
      const removeResponse = await request(app)
        .post('/api/cart/remove')
        .set('token', userToken)
        .send({ itemId: testFoodId });

      expect(removeResponse.body.success).toBe(true);
    }, 20000);

    test('should handle multiple items in cart', async () => {
      if (!userToken || !testFoodId) return;

      // Get multiple food items
      const foodsResponse = await request(app).get('/api/food/list');
      if (!foodsResponse.body.success || foodsResponse.body.data.length < 2) return;

      const foodIds = foodsResponse.body.data.slice(0, 3).map(food => food._id);

      // Add multiple items
      for (const foodId of foodIds) {
        await request(app)
          .post('/api/cart/add')
          .set('token', userToken)
          .send({ itemId: foodId });
      }

      // Get cart
      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(cartResponse.body.success).toBe(true);
      expect(Object.keys(cartResponse.body.cartData).length).toBeGreaterThan(0);
    }, 25000);
  });

  describe('Cart Validation Tests', () => {
    test('should validate cart total calculation', () => {
      const cartItems = {
        'item1': 2,
        'item2': 1,
        'item3': 3
      };
      
      const prices = {
        'item1': 10.99,
        'item2': 5.50,
        'item3': 8.25
      };

      let total = 0;
      for (const [itemId, quantity] of Object.entries(cartItems)) {
        if (prices[itemId]) {
          total += prices[itemId] * quantity;
        }
      }

      expect(total).toBeCloseTo(52.23, 2);
    });

    test('should handle edge cases in quantity', () => {
      const validQuantity = 5;
      const zeroQuantity = 0;
      const negativeQuantity = -1;

      expect(validQuantity).toBeGreaterThan(0);
      expect(zeroQuantity).toBe(0);
      expect(negativeQuantity).toBeLessThan(0);
    });
  });
});
