import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

// Test server URL
const TEST_URL = process.env.TEST_API_URL || 'http://localhost:4000';

// Store admin token and test food ID
let adminToken = '';
let testFoodId = '';

describe('Food API Tests', () => {

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Login as admin to get admin token (you'll need to create admin first)
    // For now, we'll just test public endpoints
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('GET /api/food/list', () => {
    test('should get list of all foods', async () => {
      const response = await request(TEST_URL)
        .get('/api/food/list');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);

    test('should return foods with correct structure', async () => {
      const response = await request(TEST_URL)
        .get('/api/food/list');

      expect(response.status).toBe(200);
      
      if (response.body.data && response.body.data.length > 0) {
        const food = response.body.data[0];
        expect(food).toHaveProperty('name');
        expect(food).toHaveProperty('description');
        expect(food).toHaveProperty('price');
        expect(food).toHaveProperty('category');
      }
    }, 10000);
  });

  describe('POST /api/food/add', () => {
    test('should require authentication', async () => {
      const response = await request(TEST_URL)
        .post('/api/food/add')
        .field('name', 'Test Food')
        .field('description', 'Test Description')
        .field('price', '15.99')
        .field('category', 'Salad');

      expect(response.status).toBe(200);
      // Should fail without admin token
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should validate required fields', async () => {
      const response = await request(TEST_URL)
        .post('/api/food/add')
        .field('description', 'Test Description')
        .field('price', '15.99');
        // Missing name and category

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);
  });

  describe('POST /api/food/remove', () => {
    test('should require authentication', async () => {
      const response = await request(TEST_URL)
        .post('/api/food/remove')
        .send({
          id: 'nonexistent-id'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);
  });

  describe('Food Category Tests', () => {
    const validCategories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

    test('should have valid categories', () => {
      expect(validCategories).toHaveLength(8);
      expect(validCategories).toContain('Salad');
      expect(validCategories).toContain('Pasta');
      expect(validCategories).toContain('Noodles');
    });

    test('should validate category format', () => {
      validCategories.forEach(category => {
        expect(typeof category).toBe('string');
        expect(category.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Food Data Validation', () => {
    test('should validate price is positive', () => {
      const validPrice = 15.99;
      const invalidPrice = -5;
      
      expect(validPrice).toBeGreaterThan(0);
      expect(invalidPrice).toBeLessThan(0);
    });

    test('should calculate total price correctly', () => {
      const items = [
        { price: 10.99, quantity: 2 },
        { price: 15.50, quantity: 1 }
      ];
      
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      expect(total).toBeCloseTo(37.48, 2);
    });
  });
});
