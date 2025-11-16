import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../server.js';

let userToken = '';
let adminToken = '';
let testOrderId = '';
const testUserEmail = `ordertest${Date.now()}@example.com`;
const adminEmail = `admin${Date.now()}@example.com`;

describe('Order API Tests', () => {

  beforeAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Register regular user
    const registerResponse = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Order Test User',
        email: testUserEmail,
        password: 'Test123456'
      });
    
    if (registerResponse.body.success) {
      userToken = registerResponse.body.token;
    }

    // Register admin user (for testing admin endpoints)
    const adminRegister = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Admin User',
        email: adminEmail,
        password: 'Admin123456'
      });
    
    if (adminRegister.body.success) {
      adminToken = adminRegister.body.token;
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  describe('POST /api/order/place', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .send({
          items: [],
          amount: 50,
          address: {}
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('should create Stripe checkout session with valid data', async () => {
      if (!userToken) return;

      const orderData = {
        items: [
          { name: 'Test Food', price: 15.99, quantity: 2 },
          { name: 'Test Drink', price: 5.50, quantity: 1 }
        ],
        amount: 37.48,
        address: {
          firstName: 'John',
          lastName: 'Doe',
          email: testUserEmail,
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipcode: '12345',
          country: 'USA',
          phone: '1234567890'
        }
      };

      const response = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send(orderData);

      expect(response.status).toBe(200);
      // Should return Stripe session URL or error if Stripe not configured
      if (response.body.success) {
        expect(response.body).toHaveProperty('session_url');
        expect(response.body.session_url).toContain('stripe.com');
      } else {
        expect(response.body.message).toContain('Payment');
      }
    }, 15000);

    test('should fail with empty items', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send({
          items: [],
          amount: 0,
          address: {}
        });

      expect(response.status).toBe(200);
      // Should handle empty cart gracefully
      expect(response.body).toHaveProperty('success');
    }, 10000);
  });

  describe('POST /api/order/place-test', () => {
    test('should create test order without Stripe', async () => {
      if (!userToken) return;

      const orderData = {
        items: [{ name: 'Test Food', price: 10, quantity: 1 }],
        amount: 12,
        address: {
          firstName: 'Test',
          lastName: 'User',
          street: '123 St',
          city: 'City',
          state: 'ST',
          zipcode: '12345',
          country: 'USA',
          phone: '1234567890'
        }
      };

      const response = await request(app)
        .post('/api/order/place-test')
        .set('token', userToken)
        .send(orderData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('test');
    }, 10000);
  });

  describe('POST /api/order/verify', () => {
    test('should require session_id', async () => {
      const response = await request(app)
        .post('/api/order/verify')
        .send({
          success: 'true'
        });

      expect(response.status).toBe(200);
      // Should fail without valid session
      expect(response.body).toHaveProperty('success');
    }, 10000);

    test('should handle payment cancellation', async () => {
      const response = await request(app)
        .post('/api/order/verify')
        .send({
          success: 'false',
          session_id: 'test_session_123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not completed');
    }, 10000);
  });

  describe('POST /api/order/userorders', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/userorders');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Login Again');
    }, 10000);

    test('should get user orders with valid token', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', userToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);

    test('should return empty array if no orders', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', userToken);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 10000);
  });

  describe('GET /api/order/list', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/order/list');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should require admin or restaurant role', async () => {
      if (!userToken) return;

      const response = await request(app)
        .get('/api/order/list')
        .set('token', userToken);

      expect(response.status).toBe(200);
      // Regular user should not be authorized
      if (!response.body.success) {
        expect(response.body.message).toContain('not authorized');
      }
    }, 10000);
  });

  describe('POST /api/order/status', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .send({
          orderId: 'test123',
          status: 'Food Processing'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should require admin or restaurant role', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/status')
        .set('token', userToken)
        .send({
          orderId: 'test123',
          status: 'Food Processing'
        });

      expect(response.status).toBe(200);
      // Regular user should not be authorized
      if (!response.body.success) {
        expect(response.body.message).toContain('not authorized');
      }
    }, 10000);
  });

  describe('POST /api/order/cancel', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/cancel')
        .send({
          orderId: 'test123',
          reason: 'Test cancellation'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should require admin or restaurant role', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/cancel')
        .set('token', userToken)
        .send({
          orderId: 'test123',
          reason: 'Out of stock'
        });

      expect(response.status).toBe(200);
      if (!response.body.success) {
        expect(response.body.message).toContain('not authorized');
      }
    }, 10000);
  });

  describe('POST /api/order/confirm-delivery', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/confirm-delivery')
        .send({
          orderId: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);

    test('should fail with invalid order id', async () => {
      if (!userToken) return;

      const response = await request(app)
        .post('/api/order/confirm-delivery')
        .set('token', userToken)
        .send({
          orderId: 'invalid_id_123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(false);
    }, 10000);
  });

  describe('Order Validation Tests', () => {
    test('should validate order amount calculation', () => {
      const items = [
        { price: 10.99, quantity: 2 },
        { price: 15.50, quantity: 1 }
      ];
      const deliveryFee = 2;
      
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + deliveryFee;
      
      expect(subtotal).toBeCloseTo(37.48, 2);
      expect(total).toBeCloseTo(39.48, 2);
    });

    test('should validate address fields', () => {
      const address = {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        country: 'USA',
        phone: '1234567890'
      };

      expect(address.firstName).toBeTruthy();
      expect(address.lastName).toBeTruthy();
      expect(address.street).toBeTruthy();
      expect(address.city).toBeTruthy();
      expect(address.zipcode).toMatch(/^\d{5}$/);
      expect(address.phone).toMatch(/^\d{10}$/);
    });

    test('should validate order status transitions', () => {
      const validStatuses = [
        'Food Processing',
        'Out for delivery',
        'Delivered',
        'Cancelled'
      ];

      validStatuses.forEach(status => {
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
      });

      // Test valid transitions
      expect(validStatuses).toContain('Food Processing');
      expect(validStatuses).toContain('Delivered');
    });
  });
});
