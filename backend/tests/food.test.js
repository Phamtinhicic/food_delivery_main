import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Food API Tests', () => {
  let adminToken;
  let testFoodId;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/FoodDeliveryTest');
    }

    // Login as admin to get token
    const adminResponse = await request(app)
      .post('/api/user/login')
      .send({
        email: 'admin@example.com',
        password: 'AdminPass123'
      });

    if (adminResponse.body.success) {
      adminToken = adminResponse.body.token;
    }
  });

  afterAll(async () => {
    // Cleanup: Delete test food if created
    if (testFoodId) {
      await mongoose.connection.collection('foods').deleteOne({ _id: new mongoose.Types.ObjectId(testFoodId) });
    }
    await mongoose.connection.close();
  });

  describe('GET /api/food/list', () => {
    it('should get list of all foods', async () => {
      const response = await request(app)
        .get('/api/food/list')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return foods with correct structure', async () => {
      const response = await request(app)
        .get('/api/food/list')
        .expect(200);

      if (response.body.data.length > 0) {
        const food = response.body.data[0];
        expect(food).toHaveProperty('_id');
        expect(food).toHaveProperty('name');
        expect(food).toHaveProperty('price');
        expect(food).toHaveProperty('category');
      }
    });
  });

  describe('POST /api/food/add', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/add')
        .field('name', 'Test Food')
        .field('description', 'Test Description')
        .field('price', 15)
        .field('category', 'Salad')
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should add new food with admin token', async () => {
      if (!adminToken) {
        console.warn('Admin token not available, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/food/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', `Test Food ${Date.now()}`)
        .field('description', 'Delicious test food item')
        .field('price', 12.99)
        .field('category', 'Salad')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('Food Added');
      
      // Store ID for cleanup
      if (response.body.data) {
        testFoodId = response.body.data._id;
      }
    });

    it('should fail to add food without name', async () => {
      if (!adminToken) {
        console.warn('Admin token not available, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/food/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('description', 'Test Description')
        .field('price', 15)
        .field('category', 'Salad')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail to add food with invalid price', async () => {
      if (!adminToken) {
        console.warn('Admin token not available, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/food/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Test Food')
        .field('description', 'Test Description')
        .field('price', -5)
        .field('category', 'Salad')
        .expect(400);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/food/remove', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/food/remove')
        .send({ id: 'someid123' })
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
    });

    it('should fail to remove non-existent food', async () => {
      if (!adminToken) {
        console.warn('Admin token not available, skipping test');
        return;
      }

      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post('/api/food/remove')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: fakeId.toString() })
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Food Category Tests', () => {
    const validCategories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

    it('should only accept valid categories', async () => {
      if (!adminToken) {
        console.warn('Admin token not available, skipping test');
        return;
      }

      const response = await request(app)
        .post('/api/food/add')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('name', 'Invalid Category Food')
        .field('description', 'Test')
        .field('price', 10)
        .field('category', 'InvalidCategory');

      // Should either fail or normalize to valid category
      if (response.body.success) {
        expect(validCategories).toContain(response.body.data.category);
      } else {
        expect(response.body.success).toBe(false);
      }
    });
  });
});
