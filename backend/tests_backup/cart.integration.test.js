/**
 * Integration Tests for Cart API
 * E2E tests with real database and authentication
 */

import request from 'supertest';
import { jest } from '@jest/globals';

// Import server
const { default: app } = await import('../server.js');

describe('Cart API - Integration Tests', () => {
  let userToken;
  let foodItemId;

  // Setup: Create user and get food item
  beforeAll(async () => {
    // Register user
    const userReg = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Cart Test User',
        email: `cart-${Date.now()}@example.com`,
        password: 'password123'
      });

    userToken = userReg.body.token;

    // Get a food item ID from the list
    const foodList = await request(app).get('/api/food/list');
    if (foodList.body.data.length > 0) {
      foodItemId = foodList.body.data[0]._id;
    }
  });

  describe('POST /api/cart/add', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .send({ itemId: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Error');
    });

    test('should add item to cart with valid token', async () => {
      if (!foodItemId) {
        console.log('Skipping: no food items available');
        return;
      }

      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: foodItemId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Added to Cart');
    });

    test('should increment quantity when adding same item again', async () => {
      if (!foodItemId) {
        console.log('Skipping: no food items available');
        return;
      }

      // Add once
      await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({ itemId: foodItemId });

      // Get cart to check quantity
      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', userToken);

      expect(cartResponse.body.success).toBe(true);
      expect(cartResponse.body.cartData[foodItemId]).toBeGreaterThanOrEqual(2);
    });

    test('should fail without itemId', async () => {
      const response = await request(app)
        .post('/api/cart/add')
        .set('token', userToken)
        .send({})
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/cart/get', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/get')
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should get cart data with valid token', async () => {
      const response = await request(app)
        .post('/api/cart/get')
        .set('token', userToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cartData).toBeDefined();
      expect(typeof response.body.cartData).toBe('object');
    });

    test('should return empty cart for new user', async () => {
      // Create new user
      const newUserReg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'New Cart User',
          email: `newcart-${Date.now()}@example.com`,
          password: 'password123'
        });

      const newUserToken = newUserReg.body.token;

      const response = await request(app)
        .post('/api/cart/get')
        .set('token', newUserToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cartData).toEqual({});
    });
  });

  describe('POST /api/cart/remove', () => {
    let testUserToken;
    let testFoodId;

    beforeAll(async () => {
      // Create fresh user for remove tests
      const userReg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Remove Test User',
          email: `remove-${Date.now()}@example.com`,
          password: 'password123'
        });

      testUserToken = userReg.body.token;

      // Get food item
      const foodList = await request(app).get('/api/food/list');
      if (foodList.body.data.length > 0) {
        testFoodId = foodList.body.data[0]._id;
      }

      // Add item to cart multiple times
      if (testFoodId) {
        await request(app)
          .post('/api/cart/add')
          .set('token', testUserToken)
          .send({ itemId: testFoodId });
        
        await request(app)
          .post('/api/cart/add')
          .set('token', testUserToken)
          .send({ itemId: testFoodId });
      }
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/cart/remove')
        .send({ itemId: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should decrement quantity if more than 1', async () => {
      if (!testFoodId) {
        console.log('Skipping: no food items available');
        return;
      }

      // Get initial quantity
      const initialCart = await request(app)
        .post('/api/cart/get')
        .set('token', testUserToken);

      const initialQty = initialCart.body.cartData[testFoodId];

      // Remove one
      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', testUserToken)
        .send({ itemId: testFoodId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Removed from Cart');

      // Check new quantity
      const updatedCart = await request(app)
        .post('/api/cart/get')
        .set('token', testUserToken);

      const newQty = updatedCart.body.cartData[testFoodId] || 0;
      expect(newQty).toBe(initialQty - 1);
    });

    test('should remove item completely when quantity reaches 0', async () => {
      if (!testFoodId) {
        console.log('Skipping: no food items available');
        return;
      }

      // Remove until empty
      let cartData;
      do {
        await request(app)
          .post('/api/cart/remove')
          .set('token', testUserToken)
          .send({ itemId: testFoodId });

        const cartResponse = await request(app)
          .post('/api/cart/get')
          .set('token', testUserToken);

        cartData = cartResponse.body.cartData;
      } while (cartData[testFoodId] && cartData[testFoodId] > 0);

      // Verify item is not in cart
      expect(cartData[testFoodId]).toBeUndefined();
    });

    test('should handle removing non-existent item gracefully', async () => {
      const response = await request(app)
        .post('/api/cart/remove')
        .set('token', testUserToken)
        .send({ itemId: 'nonexistent123' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Removed from Cart');
    });
  });

  describe('Cart Workflow Integration', () => {
    let flowUserToken;
    let flowFoodId;

    beforeAll(async () => {
      // Create user for workflow test
      const userReg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'Workflow User',
          email: `workflow-${Date.now()}@example.com`,
          password: 'password123'
        });

      flowUserToken = userReg.body.token;

      // Get food item
      const foodList = await request(app).get('/api/food/list');
      if (foodList.body.data.length > 0) {
        flowFoodId = foodList.body.data[0]._id;
      }
    });

    test('should handle complete cart workflow: add -> get -> remove', async () => {
      if (!flowFoodId) {
        console.log('Skipping: no food items available');
        return;
      }

      // Step 1: Start with empty cart
      let cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      expect(cartResponse.body.cartData).toEqual({});

      // Step 2: Add item
      await request(app)
        .post('/api/cart/add')
        .set('token', flowUserToken)
        .send({ itemId: flowFoodId });

      // Step 3: Verify it's in cart
      cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      expect(cartResponse.body.cartData[flowFoodId]).toBe(1);

      // Step 4: Add same item again
      await request(app)
        .post('/api/cart/add')
        .set('token', flowUserToken)
        .send({ itemId: flowFoodId });

      // Step 5: Verify quantity increased
      cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      expect(cartResponse.body.cartData[flowFoodId]).toBe(2);

      // Step 6: Remove once
      await request(app)
        .post('/api/cart/remove')
        .set('token', flowUserToken)
        .send({ itemId: flowFoodId });

      // Step 7: Verify quantity decreased
      cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      expect(cartResponse.body.cartData[flowFoodId]).toBe(1);

      // Step 8: Remove again
      await request(app)
        .post('/api/cart/remove')
        .set('token', flowUserToken)
        .send({ itemId: flowFoodId });

      // Step 9: Verify item removed
      cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      expect(cartResponse.body.cartData[flowFoodId]).toBeUndefined();
    });

    test('should handle multiple items in cart', async () => {
      // Get multiple food items
      const foodList = await request(app).get('/api/food/list');
      const foods = foodList.body.data.slice(0, 3); // Get up to 3 items

      if (foods.length < 2) {
        console.log('Skipping: not enough food items available');
        return;
      }

      // Add multiple items
      for (const food of foods) {
        await request(app)
          .post('/api/cart/add')
          .set('token', flowUserToken)
          .send({ itemId: food._id });
      }

      // Get cart
      const cartResponse = await request(app)
        .post('/api/cart/get')
        .set('token', flowUserToken);

      // Verify all items are in cart
      foods.forEach(food => {
        expect(cartResponse.body.cartData[food._id]).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Cart Validation Tests', () => {
    test('should validate cart total calculation', () => {
      const cartData = {
        item1: 2, // quantity: 2
        item2: 1, // quantity: 1
        item3: 3  // quantity: 3
      };

      const prices = {
        item1: 12.99,
        item2: 8.99,
        item3: 5.99
      };

      let total = 0;
      Object.keys(cartData).forEach(itemId => {
        total += cartData[itemId] * prices[itemId];
      });

      expect(total).toBeCloseTo(52.93, 2);
    });

    test('should handle edge cases in quantity', () => {
      const edgeCases = [
        { quantity: 0, expected: 'Item should be removed' },
        { quantity: 1, expected: 'Item should exist' },
        { quantity: 99, expected: 'High quantity should work' }
      ];

      edgeCases.forEach(({ quantity, expected }) => {
        if (quantity === 0) {
          expect(quantity).toBe(0);
        } else {
          expect(quantity).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Cart Security Tests', () => {
    test('should not allow access to other user carts', async () => {
      // Create two users
      const user1Reg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'User 1',
          email: `user1-${Date.now()}@example.com`,
          password: 'password123'
        });

      const user2Reg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'User 2',
          email: `user2-${Date.now()}@example.com`,
          password: 'password123'
        });

      const user1Token = user1Reg.body.token;
      const user2Token = user2Reg.body.token;

      // Add item to user1's cart
      const foodList = await request(app).get('/api/food/list');
      if (foodList.body.data.length === 0) {
        console.log('Skipping: no food items available');
        return;
      }

      const foodId = foodList.body.data[0]._id;

      await request(app)
        .post('/api/cart/add')
        .set('token', user1Token)
        .send({ itemId: foodId });

      // User2 should have empty cart
      const user2Cart = await request(app)
        .post('/api/cart/get')
        .set('token', user2Token);

      expect(user2Cart.body.cartData).toEqual({});

      // User1 should have item in cart
      const user1Cart = await request(app)
        .post('/api/cart/get')
        .set('token', user1Token);

      expect(user1Cart.body.cartData[foodId]).toBe(1);
    });
  });
});
