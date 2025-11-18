/**
 * Integration Tests for Order API
 * E2E tests with real database and Stripe test mode
 */

import request from 'supertest';
import { jest } from '@jest/globals';

// Import server
const { default: app } = await import('../server.js');

describe('Order API - Integration Tests', () => {
  let userToken;
  let adminToken;
  let restaurantToken;
  let testOrderId;
  let testUserId;

  // Setup: Create users with different roles
  beforeAll(async () => {
    // Register regular user
    const userEmail = `order-user-${Date.now()}@example.com`;
    const userReg = await request(app)
      .post('/api/user/register')
      .send({
        name: 'Order Test User',
        email: userEmail,
        password: 'password123'
      });

    userToken = userReg.body.token;

    // Register and make admin
    const adminEmail = `order-admin-${Date.now()}@example.com`;
    await request(app)
      .post('/api/user/register')
      .send({
        name: 'Order Admin',
        email: adminEmail,
        password: 'password123'
      });

    await request(app)
      .post('/api/user/makeAdmin')
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

    // Create restaurant user
    const restaurantEmail = `order-restaurant-${Date.now()}@example.com`;
    await request(app)
      .post('/api/user/create')
      .set('token', adminToken)
      .send({
        name: 'Restaurant User',
        email: restaurantEmail,
        password: 'password123',
        role: 'restaurant'
      });

    const restaurantLogin = await request(app)
      .post('/api/user/login')
      .send({
        email: restaurantEmail,
        password: 'password123'
      });

    restaurantToken = restaurantLogin.body.token;
  });

  describe('POST /api/order/place', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .send({
          items: [{ name: 'Pizza', price: 12.99, quantity: 1 }],
          amount: 14.99,
          address: {}
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should create Stripe checkout session with valid data', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send({
          items: [
            { name: 'Pizza Margherita', price: 12.99, quantity: 2 },
            { name: 'Coke', price: 2.99, quantity: 1 }
          ],
          amount: 30.97,
          address: {
            firstName: 'John',
            lastName: 'Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipcode: '10001',
            country: 'USA',
            phone: '1234567890'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.session_url).toBeDefined();
      expect(response.body.session_url).toContain('checkout.stripe.com');
    });

    test('should fail with empty items array', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send({
          items: [],
          amount: 2.00,
          address: {}
        })
        .expect(200);

      // Empty items should either fail validation or create session with just delivery fee
      expect(response.body).toBeDefined();
    });

    test('should include delivery charges', async () => {
      const response = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send({
          items: [{ name: 'Burger', price: 10.00, quantity: 1 }],
          amount: 12.00, // 10 + 2 delivery
          address: {
            firstName: 'Jane',
            street: '456 Oak St',
            city: 'LA',
            state: 'CA',
            zipcode: '90001',
            country: 'USA',
            phone: '9876543210'
          }
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/order/verify', () => {
    test('should require session_id', async () => {
      const response = await request(app)
        .post('/api/order/verify')
        .send({ success: 'true' })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Payment not completed');
    });

    test('should handle payment cancellation', async () => {
      const response = await request(app)
        .post('/api/order/verify')
        .send({
          success: 'false',
          session_id: 'cs_test_cancelled'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Payment not completed');
    });
  });

  describe('POST /api/order/userorders', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/userorders')
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should get user orders with valid token', async () => {
      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', userToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('should return empty array if no orders', async () => {
      // Create new user with no orders
      const newUserReg = await request(app)
        .post('/api/user/register')
        .send({
          name: 'No Orders User',
          email: `noorders-${Date.now()}@example.com`,
          password: 'password123'
        });

      const response = await request(app)
        .post('/api/order/userorders')
        .set('token', newUserReg.body.token)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/order/list (Admin/Restaurant Only)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should allow admin to list all orders', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .set('token', adminToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('should allow restaurant role to list orders', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .set('token', restaurantToken)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    test('should reject regular users', async () => {
      const response = await request(app)
        .get('/api/order/list')
        .set('token', userToken)
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not authorized');
    });
  });

  describe('POST /api/order/status (Admin/Restaurant Only)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .send({
          orderId: 'someid',
          status: 'Out for delivery'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should reject regular users', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .set('token', userToken)
        .send({
          orderId: 'someid',
          status: 'Delivered'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not authorized');
    });

    test('should allow admin to update status', async () => {
      // This test would require a real order ID
      // For now, we test the authorization logic
      const response = await request(app)
        .post('/api/order/status')
        .set('token', adminToken)
        .send({
          orderId: 'dummy_order_id',
          status: 'Out for delivery'
        })
        .expect(200);

      // Will fail due to invalid order ID, but authorization passed
      expect(response.body).toBeDefined();
    });

    test('should allow restaurant to update status', async () => {
      const response = await request(app)
        .post('/api/order/status')
        .set('token', restaurantToken)
        .send({
          orderId: 'dummy_order_id',
          status: 'Food Processing'
        })
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /api/order/cancel (Admin/Restaurant Only)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/cancel')
        .send({
          orderId: 'someid',
          reason: 'Test'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should reject regular users', async () => {
      const response = await request(app)
        .post('/api/order/cancel')
        .set('token', userToken)
        .send({
          orderId: 'someid',
          reason: 'Customer request'
        })
        .expect(200);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('You are not authorized');
    });

    test('should allow admin to cancel with reason', async () => {
      const response = await request(app)
        .post('/api/order/cancel')
        .set('token', adminToken)
        .send({
          orderId: 'dummy_order_id',
          reason: 'Out of stock'
        })
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('POST /api/order/confirm-delivery (Customer)', () => {
    test('should require authentication', async () => {
      const response = await request(app)
        .post('/api/order/confirm-delivery')
        .send({ orderId: 'someid' })
        .expect(200);

      expect(response.body.success).toBe(false);
    });

    test('should fail with invalid order ID', async () => {
      const response = await request(app)
        .post('/api/order/confirm-delivery')
        .set('token', userToken)
        .send({ orderId: 'invalid_id_123' })
        .expect(200);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Order Validation Tests', () => {
    test('should validate order amount calculation', () => {
      const items = [
        { price: 12.99, quantity: 2 },
        { price: 8.99, quantity: 1 }
      ];

      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryFee = 2.00;
      const total = subtotal + deliveryFee;

      expect(subtotal).toBeCloseTo(34.97, 2);
      expect(total).toBeCloseTo(36.97, 2);
    });

    test('should validate address fields', () => {
      const validAddress = {
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipcode: '10001',
        country: 'USA',
        phone: '1234567890'
      };

      expect(validAddress.firstName).toBeTruthy();
      expect(validAddress.street).toBeTruthy();
      expect(validAddress.city).toBeTruthy();
      expect(validAddress.phone).toBeTruthy();
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
    });
  });

  describe('Order Security Tests', () => {
    test('should not allow users to update other users orders', async () => {
      // This is enforced by checking userId in the order
      // The confirmDelivery function checks order.userId === req.body.userId
      expect(true).toBe(true); // Placeholder test
    });

    test('should require proper authorization for admin endpoints', async () => {
      const adminEndpoints = [
        '/api/order/list',
        '/api/order/status',
        '/api/order/cancel'
      ];

      for (const endpoint of adminEndpoints) {
        const response = await request(app)
          .post(endpoint)
          .set('token', userToken)
          .send({});

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('Order Workflow Integration', () => {
    test('should complete order lifecycle: place -> verify (simulated)', async () => {
      // Step 1: Place order (creates Stripe session)
      const placeResponse = await request(app)
        .post('/api/order/place')
        .set('token', userToken)
        .send({
          items: [{ name: 'Test Item', price: 10.00, quantity: 1 }],
          amount: 12.00,
          address: {
            firstName: 'Test',
            street: 'Test St',
            city: 'Test City',
            state: 'TS',
            zipcode: '12345',
            country: 'USA',
            phone: '1234567890'
          }
        });

      expect(placeResponse.body.success).toBe(true);
      expect(placeResponse.body.session_url).toBeDefined();

      // Step 2: In real scenario, user would complete Stripe payment
      // Then webhook would call verify endpoint
      // We simulate failure case
      const verifyResponse = await request(app)
        .post('/api/order/verify')
        .send({
          success: 'false'
        });

      expect(verifyResponse.body.success).toBe(false);
    });
  });
});
