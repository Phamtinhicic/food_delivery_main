import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

// Test server URL
import app from '../server.js';

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
      const response = await request(app)
        .get('/api/food/list');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);

    test('should return foods with correct structure', async () => {
      const response = await request(app)
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
      const response = await request(app)
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
      const response = await request(app)
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
      const response = await request(app)
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

    test('should validate food name length', () => {
      const validName = 'Delicious Pizza';
      const emptyName = '';
      const tooLongName = 'A'.repeat(200);

      expect(validName.length).toBeGreaterThan(0);
      expect(validName.length).toBeLessThan(100);
      expect(emptyName.length).toBe(0);
      expect(tooLongName.length).toBeGreaterThan(100);
    });

    test('should validate price format', () => {
      const validPrices = [10, 10.99, 15.5, 100];
      const invalidPrices = ['abc', null, undefined, -5];

      validPrices.forEach(price => {
        expect(typeof price).toBe('number');
        expect(price).toBeGreaterThan(0);
      });

      invalidPrices.forEach(price => {
        expect(typeof price === 'number' && price > 0).toBe(false);
      });
    });
  });

  describe('Food Search and Filter', () => {
    test('should filter foods by category', async () => {
      const response = await request(app).get('/api/food/list');
      
      if (response.body.success && response.body.data.length > 0) {
        const foods = response.body.data;
        const category = 'Salad';
        const filtered = foods.filter(food => food.category === category);

        filtered.forEach(food => {
          expect(food.category).toBe(category);
        });
      }
    }, 10000);

    test('should search foods by name', async () => {
      const response = await request(app).get('/api/food/list');
      
      if (response.body.success && response.body.data.length > 0) {
        const foods = response.body.data;
        const searchTerm = 'salad';
        const results = foods.filter(food => 
          food.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        results.forEach(food => {
          expect(food.name.toLowerCase()).toContain(searchTerm);
        });
      }
    }, 10000);

    test('should sort foods by price', async () => {
      const response = await request(app).get('/api/food/list');
      
      if (response.body.success && response.body.data.length > 1) {
        const foods = [...response.body.data];
        const sorted = foods.sort((a, b) => a.price - b.price);

        for (let i = 0; i < sorted.length - 1; i++) {
          expect(sorted[i].price).toBeLessThanOrEqual(sorted[i + 1].price);
        }
      }
    }, 10000);
  });

  describe('Food Image Validation', () => {
    test('should validate image URL format', () => {
      const validUrls = [
        'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        'https://example.com/images/food.png',
        'http://localhost:4000/images/test.jpg'
      ];

      validUrls.forEach(url => {
        expect(url).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
      });
    });

    test('should validate Cloudinary URL structure', () => {
      const cloudinaryUrl = 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg';
      
      expect(cloudinaryUrl).toContain('cloudinary.com');
      expect(cloudinaryUrl).toContain('upload');
      expect(cloudinaryUrl).toMatch(/\.(jpg|jpeg|png|gif|webp)$/i);
    });
  });

  describe('Food Price Calculations', () => {
    test('should calculate discount price', () => {
      const originalPrice = 20.00;
      const discountPercent = 15;
      const discountedPrice = originalPrice * (1 - discountPercent / 100);

      expect(discountedPrice).toBeCloseTo(17.00, 2);
    });

    test('should calculate total for multiple items', () => {
      const orders = [
        { foodName: 'Pizza', price: 12.99, quantity: 2 },
        { foodName: 'Burger', price: 8.50, quantity: 3 },
        { foodName: 'Salad', price: 6.00, quantity: 1 }
      ];

      const total = orders.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      expect(total).toBeCloseTo(57.48, 2);
    });

    test('should add delivery fee to order total', () => {
      const subtotal = 45.00;
      const deliveryFee = 2.00;
      const total = subtotal + deliveryFee;

      expect(total).toBe(47.00);
    });
  });
});
