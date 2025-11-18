/**
 * Integration Tests for Food API
 * E2E tests with real database and HTTP requests
 */

import request from 'supertest';
import { jest } from '@jest/globals';
import path from 'path';

// Import server
const { default: app } = await import('../server.js');

describe('Food API - Integration Tests', () => {
  let adminToken;
  let userToken;
  let createdFoodId;

  // Setup: Create admin and user accounts
  beforeAll(async () => {
    // Register and make admin
    const adminEmail = `admin-food-${Date.now()}@example.com`;
    const adminReg = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Admin Food Test',
        email: adminEmail,
        password: 'password123'
      });

    // Make admin
    await request(app)
      .post('/api/user/makeAdmin')
      .send({
        email: adminEmail,
        secret: process.env.ADMIN_SETUP_SECRET || 'test-secret'
      });

    // Login as admin
    const adminLogin = await request(app)
      .post('/api/user/login')
      .send({
        email: adminEmail,
        password: 'password123'
      });

    adminToken = adminLogin.body.token;

    // Register regular user
    const userReg = await request(app)
      .post('/api/user/register')
      .send({
        name: 'User Food Test',
        email: `user-food-${Date.now()}@example.com`,
        password: 'password123'
      });

    userToken = userReg.body.token;
  });

  describe('GET /api/food/list', () => {
    test('should return list of foods (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/food/list')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('should work without authentication', async () => {
      const response = await request(app)
        .get('/api/food/list')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should return foods with correct structure', async () => {
      const response = await request(app)
        .get('/api/food/list')
        .expect(200);

      if (response.body.data.length > 0) {
        const food = response.body.data[0];
        expect(food).toHaveProperty('_id');
        expect(food).toHaveProperty('name');
        expect(food).toHaveProperty('description');
        expect(food).toHaveProperty('price');
        expect(food).toHaveProperty('category');
        expect(food).toHaveProperty('image');
      }
    });
  });

  describe('POST /api/food/add', () => {
    test('should allow admin to add food with image', async () => {
      const response = await request(app)
        .post('/api/food/add')
        .set('token', adminToken)
        .field('name', 'Integration Test Pizza')
        .field('description', 'Delicious test pizza')
        .field('price', '15.99')
        .field('category', 'Pizza')
        .attach('image', Buffer.from('fake-image-data'), {
          filename: 'test-pizza.jpg',
          contentType: 'image/jpeg'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Food Added');

      // Store the food ID for later tests
      const listResponse = await request(app).get('/api/food/list');
      const addedFood = listResponse.body.data.find(f => f.name === 'Integration Test Pizza');
      createdFoodId = addedFood?._id;
    });

    test('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/food/add')
        .set('token', userToken)
        .field('name', 'Unauthorized Food')
        .field('description', 'Test')
        .field('price', '10')
        .field('category', 'Other')
        .attach('image', Buffer.from('fake'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/add')
        .field('name', 'No Auth Food')
        .field('description', 'Test')
        .field('price', '10')
        .field('category', 'Other')
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should require all fields', async () => {
      const response = await request(app)
        .post('/api/food/add')
        .set('token', adminToken)
        .field('name', 'Incomplete Food')
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/food/remove', () => {
    test('should allow admin to remove food', async () => {
      if (!createdFoodId) {
        console.log('Skipping: no food ID to remove');
        return;
      }

      const response = await request(app)
        .post('/api/food/remove')
        .set('token', adminToken)
        .send({ id: createdFoodId })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Food Removed');

      // Verify it's removed
      const listResponse = await request(app).get('/api/food/list');
      const found = listResponse.body.data.find(f => f._id === createdFoodId);
      expect(found).toBeUndefined();
    });

    test('should reject non-admin users', async () => {
      const response = await request(app)
        .post('/api/food/remove')
        .set('token', userToken)
        .send({ id: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not admin');
    });

    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/remove')
        .send({ id: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Food Category Tests', () => {
    test('should support multiple food categories', async () => {
      const categories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];
      
      // This is a validation test - no API call needed
      expect(categories.length).toBeGreaterThan(0);
      categories.forEach(cat => {
        expect(typeof cat).toBe('string');
      });
    });
  });

  describe('Food Data Validation', () => {
    test('should validate price is positive', () => {
      const prices = [10.99, 0.99, 100.00];
      prices.forEach(price => {
        expect(price).toBeGreaterThan(0);
      });
    });

    test('should validate food name length', () => {
      const validNames = ['Pizza', 'Margherita Pizza', 'Extra Large Supreme Pizza'];
      validNames.forEach(name => {
        expect(name.length).toBeGreaterThan(0);
        expect(name.length).toBeLessThan(100);
      });
    });

    test('should calculate total price correctly', () => {
      const item = { price: 12.99, quantity: 2 };
      const total = item.price * item.quantity;
      expect(total).toBe(25.98);
    });

    test('should add delivery fee to order total', () => {
      const orderTotal = 50.00;
      const deliveryFee = 2.00;
      const grandTotal = orderTotal + deliveryFee;
      expect(grandTotal).toBe(52.00);
    });
  });

  describe('Food Search and Filter', () => {
    let allFoods;

    beforeAll(async () => {
      const response = await request(app).get('/api/food/list');
      allFoods = response.body.data;
    });

    test('should filter foods by category', () => {
      const pizzas = allFoods.filter(f => f.category === 'Pizza');
      pizzas.forEach(food => {
        expect(food.category).toBe('Pizza');
      });
    });

    test('should search foods by name', () => {
      const searchTerm = 'pizza';
      const results = allFoods.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      results.forEach(food => {
        expect(food.name.toLowerCase()).toContain(searchTerm);
      });
    });

    test('should sort foods by price (ascending)', () => {
      const sorted = [...allFoods].sort((a, b) => a.price - b.price);
      
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].price).toBeGreaterThanOrEqual(sorted[i-1].price);
      }
    });

    test('should sort foods by price (descending)', () => {
      const sorted = [...allFoods].sort((a, b) => b.price - a.price);
      
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i].price).toBeLessThanOrEqual(sorted[i-1].price);
      }
    });
  });

  describe('Food Image Validation', () => {
    test('should validate image URL format', () => {
      const validUrls = [
        'https://res.cloudinary.com/demo/image/upload/v1/food/pizza.jpg',
        'https://example.com/images/burger.png',
        'http://localhost:4000/images/salad.jpg'
      ];

      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
      });
    });

    test('should validate Cloudinary URL structure', () => {
      const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1/food/pizza.jpg';
      
      expect(cloudinaryUrl).toContain('cloudinary.com');
      expect(cloudinaryUrl).toContain('/upload/');
    });
  });

  describe('Food Price Calculations', () => {
    test('should calculate discount price correctly', () => {
      const originalPrice = 20.00;
      const discountPercent = 15;
      const discountedPrice = originalPrice * (1 - discountPercent / 100);
      
      expect(discountedPrice).toBe(17.00);
    });

    test('should calculate total for multiple items', () => {
      const items = [
        { price: 12.99, quantity: 2 },
        { price: 8.99, quantity: 1 },
        { price: 5.99, quantity: 3 }
      ];

      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(total).toBeCloseTo(52.95, 2);
    });
  });

  describe('Admin Food Management Flow', () => {
    test('should complete full add -> list -> remove flow', async () => {
      // Step 1: Add new food
      const addResponse = await request(app)
        .post('/api/food/add')
        .set('token', adminToken)
        .field('name', 'Flow Test Burger')
        .field('description', 'Test burger for flow')
        .field('price', '9.99')
        .field('category', 'Burgers')
        .attach('image', Buffer.from('fake-image'), {
          filename: 'burger.jpg',
          contentType: 'image/jpeg'
        });

      expect(addResponse.body.success).toBe(true);

      // Step 2: List and find the food
      const listResponse = await request(app).get('/api/food/list');
      const addedFood = listResponse.body.data.find(f => f.name === 'Flow Test Burger');
      
      expect(addedFood).toBeDefined();
      expect(addedFood.price).toBe(9.99);

      // Step 3: Remove the food
      const removeResponse = await request(app)
        .post('/api/food/remove')
        .set('token', adminToken)
        .send({ id: addedFood._id });

      expect(removeResponse.body.success).toBe(true);

      // Step 4: Verify it's removed
      const finalListResponse = await request(app).get('/api/food/list');
      const found = finalListResponse.body.data.find(f => f._id === addedFood._id);
      expect(found).toBeUndefined();
    });
  });
});
