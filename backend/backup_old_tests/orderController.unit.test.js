/**
 * Unit Tests for Order Controller  
 * Tests order operations with mocked Stripe and Mongoose
 */

import { jest } from '@jest/globals';

// Mock dependencies
const mockOrderModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  prototype: {
    save: jest.fn()
  }
};

const mockUserModel = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
};

const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn(),
      retrieve: jest.fn()
    }
  }
};

// Mock modules
jest.unstable_mockModule('../models/orderModel.js', () => ({
  default: mockOrderModel
}));

jest.unstable_mockModule('../models/userModel.js', () => ({
  default: mockUserModel
}));

jest.unstable_mockModule('stripe', () => ({
  default: jest.fn(() => mockStripe)
}));

// Set env before importing controller
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Import controller after mocking
const { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder, confirmDelivery } = await import('../controllers/orderController.js');

describe('Order Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('placeOrder', () => {
    test('should create Stripe checkout session', async () => {
      req.body = {
        userId: 'user123',
        items: [
          { name: 'Pizza', price: 12.99, quantity: 2 },
          { name: 'Burger', price: 8.99, quantity: 1 }
        ],
        amount: 34.97,
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
      };

      const mockSession = {
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/pay/cs_test_123'
      };

      mockStripe.checkout.sessions.create.mockResolvedValue(mockSession);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await placeOrder(req, res);

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          payment_method_types: ['card'],
          mode: 'payment',
          metadata: expect.objectContaining({
            userId: 'user123',
            amount: '34.97'
          })
        })
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: {} }
      );

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        session_url: mockSession.url
      });
    });

    test('should include delivery charges in line items', async () => {
      req.body = {
        userId: 'user123',
        items: [{ name: 'Pizza', price: 10, quantity: 1 }],
        amount: 12,
        address: {}
      };

      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test',
        url: 'https://checkout.stripe.com/pay/cs_test'
      });
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await placeOrder(req, res);

      const createCall = mockStripe.checkout.sessions.create.mock.calls[0][0];
      expect(createCall.line_items).toHaveLength(2); // Item + Delivery
      expect(createCall.line_items[1].price_data.product_data.name).toBe('Delivery Charges');
      expect(createCall.line_items[1].price_data.unit_amount).toBe(200); // $2.00
    });

    test('should clear user cart after creating session', async () => {
      req.body = {
        userId: 'user123',
        items: [{ name: 'Pizza', price: 10, quantity: 1 }],
        amount: 12,
        address: {}
      };

      mockStripe.checkout.sessions.create.mockResolvedValue({
        id: 'cs_test',
        url: 'https://checkout.stripe.com/url'
      });
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await placeOrder(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: {} }
      );
    });

    test('should handle Stripe errors', async () => {
      req.body = {
        userId: 'user123',
        items: [{ name: 'Pizza', price: 10, quantity: 1 }],
        amount: 12,
        address: {}
      };

      mockStripe.checkout.sessions.create.mockRejectedValue(
        new Error('Stripe API error')
      );

      await placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Payment Error'
        })
      );
    });
  });

  describe('verifyOrder', () => {
    test('should reject if no session_id provided', async () => {
      req.body = {
        success: 'true'
      };

      await verifyOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Payment not completed'
      });
    });

    test('should reject unpaid sessions', async () => {
      req.body = {
        session_id: 'cs_test_123',
        success: 'true'
      };

      const mockSession = {
        id: 'cs_test_123',
        payment_status: 'unpaid',
        metadata: {}
      };

      mockStripe.checkout.sessions.retrieve.mockResolvedValue(mockSession);

      await verifyOrder(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Payment not completed'
      });
    });

    test('should handle payment cancellation', async () => {
      req.body = {
        success: 'false'
      };

      await verifyOrder(req, res);

      expect(mockStripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Payment not completed'
      });
    });
  });

  describe('userOrders', () => {
    test('should return user orders', async () => {
      req.body = { userId: 'user123' };

      const mockOrders = [
        {
          _id: 'order1',
          userId: 'user123',
          items: [{ name: 'Pizza' }],
          amount: 12.99,
          status: 'Delivered'
        },
        {
          _id: 'order2',
          userId: 'user123',
          items: [{ name: 'Burger' }],
          amount: 8.99,
          status: 'Food Processing'
        }
      ];

      mockOrderModel.find.mockResolvedValue(mockOrders);

      await userOrders(req, res);

      expect(mockOrderModel.find).toHaveBeenCalledWith({ userId: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });

    test('should return empty array for users with no orders', async () => {
      req.body = { userId: 'newuser123' };

      mockOrderModel.find.mockResolvedValue([]);

      await userOrders(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });
  });

  describe('listOrders', () => {
    test('should allow admin to list all orders', async () => {
      req.body = { userId: 'admin123' };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      const mockOrders = [
        { _id: 'order1', userId: 'user1', amount: 10 },
        { _id: 'order2', userId: 'user2', amount: 20 }
      ];

      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockOrderModel.find.mockResolvedValue(mockOrders);

      await listOrders(req, res);

      expect(mockOrderModel.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockOrders
      });
    });

    test('should allow restaurant role to list orders', async () => {
      req.body = { userId: 'restaurant123' };

      const mockRestaurant = { _id: 'restaurant123', role: 'restaurant' };
      mockUserModel.findById.mockResolvedValue(mockRestaurant);
      mockOrderModel.find.mockResolvedValue([]);

      await listOrders(req, res);

      expect(mockOrderModel.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: []
      });
    });

    test('should reject regular users', async () => {
      req.body = { userId: 'user123' };

      const mockUser = { _id: 'user123', role: 'user' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      await listOrders(req, res);

      expect(mockOrderModel.find).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not authorized'
      });
    });
  });

  describe('updateStatus', () => {
    test('should allow admin to update order status', async () => {
      req.body = {
        userId: 'admin123',
        orderId: 'order123',
        status: 'Out for delivery'
      };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(true);

      await updateStatus(req, res);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'order123',
        { status: 'Out for delivery' }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status Updated Successfully'
      });
    });

    test('should allow restaurant to update status', async () => {
      req.body = {
        userId: 'restaurant123',
        orderId: 'order123',
        status: 'Food Processing'
      };

      const mockRestaurant = { _id: 'restaurant123', role: 'restaurant' };
      mockUserModel.findById.mockResolvedValue(mockRestaurant);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(true);

      await updateStatus(req, res);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Status Updated Successfully'
      });
    });

    test('should reject regular users', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'order123',
        status: 'Delivered'
      };

      const mockUser = { _id: 'user123', role: 'user' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      await updateStatus(req, res);

      expect(mockOrderModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not authorized'
      });
    });
  });

  describe('cancelOrder', () => {
    test('should allow admin to cancel order with reason', async () => {
      req.body = {
        userId: 'admin123',
        orderId: 'order123',
        reason: 'Customer request'
      };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(true);

      await cancelOrder(req, res);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'order123',
        expect.objectContaining({
          status: 'Cancelled',
          cancelReason: 'Customer request',
          cancelledBy: 'admin'
        })
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Order Cancelled Successfully'
      });
    });

    test('should use default reason if not provided', async () => {
      req.body = {
        userId: 'admin123',
        orderId: 'order123'
      };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(true);

      await cancelOrder(req, res);

      const updateCall = mockOrderModel.findByIdAndUpdate.mock.calls[0][1];
      expect(updateCall.cancelReason).toBe('No reason provided');
    });

    test('should reject non-authorized users', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'order123',
        reason: 'Test'
      };

      const mockUser = { _id: 'user123', role: 'user' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      await cancelOrder(req, res);

      expect(mockOrderModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not authorized'
      });
    });
  });

  describe('confirmDelivery', () => {
    test('should allow customer to confirm delivery for "Out for delivery" orders', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'order123'
      };

      const mockOrder = {
        _id: 'order123',
        userId: 'user123',
        status: 'Out for delivery'
      };

      mockOrderModel.findById.mockResolvedValue(mockOrder);
      mockOrderModel.findByIdAndUpdate.mockResolvedValue(true);

      await confirmDelivery(req, res);

      expect(mockOrderModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'order123',
        expect.objectContaining({
          status: 'Delivered'
        })
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Order confirmed as delivered'
      });
    });

    test('should reject if order not found', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'nonexistent'
      };

      mockOrderModel.findById.mockResolvedValue(null);

      await confirmDelivery(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order not found'
      });
    });

    test('should reject if order belongs to different user', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'order456'
      };

      const mockOrder = {
        _id: 'order456',
        userId: 'otheruser456',
        status: 'Out for delivery'
      };

      mockOrderModel.findById.mockResolvedValue(mockOrder);

      await confirmDelivery(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });

    test('should reject if order not in "Out for delivery" status', async () => {
      req.body = {
        userId: 'user123',
        orderId: 'order123'
      };

      const mockOrder = {
        _id: 'order123',
        userId: 'user123',
        status: 'Food Processing'
      };

      mockOrderModel.findById.mockResolvedValue(mockOrder);

      await confirmDelivery(req, res);

      expect(mockOrderModel.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Order is not ready for confirmation'
      });
    });
  });
});
