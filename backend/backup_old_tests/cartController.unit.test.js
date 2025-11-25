/**
 * Unit Tests for Cart Controller
 * Tests cart operations with mocked User model
 */

import { jest } from '@jest/globals';

// Mock User model
const mockUserModel = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
};

// Mock module
jest.unstable_mockModule('../models/userModel.js', () => ({
  default: mockUserModel
}));

// Import controller after mocking
const { addToCart, removeFromCart, getCart } = await import('../controllers/cartController.js');

describe('Cart Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    
    req = {
      body: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe('addToCart', () => {
    test('should add new item to empty cart', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      const mockUser = {
        _id: 'user123',
        cartData: {}
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await addToCart(req, res);

      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: { food123: 1 } }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Added to Cart'
      });
    });

    test('should increment quantity for existing item', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      const mockUser = {
        _id: 'user123',
        cartData: { food123: 2 }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await addToCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: { food123: 3 } }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Added to Cart'
      });
    });

    test('should handle multiple items in cart', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food456'
      };

      const mockUser = {
        _id: 'user123',
        cartData: {
          food123: 2,
          food789: 1
        }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await addToCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        {
          cartData: {
            food123: 2,
            food789: 1,
            food456: 1
          }
        }
      );
    });

    test('should handle database errors', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      mockUserModel.findById.mockRejectedValue(new Error('Database error'));

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });

    test('should handle user not found', async () => {
      req.body = {
        userId: 'nonexistent',
        itemId: 'food123'
      };

      mockUserModel.findById.mockResolvedValue(null);

      await addToCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('removeFromCart', () => {
    test('should decrement quantity when more than 1', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      const mockUser = {
        _id: 'user123',
        cartData: { food123: 3 }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await removeFromCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: { food123: 2 } }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Removed from Cart'
      });
    });

    test('should remove item when quantity is 1', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      const mockUser = {
        _id: 'user123',
        cartData: { food123: 1, food456: 2 }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await removeFromCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: { food456: 2 } }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Removed from Cart'
      });
    });

    test('should handle removing non-existent item gracefully', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'nonexistent'
      };

      const mockUser = {
        _id: 'user123',
        cartData: { food123: 2 }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await removeFromCart(req, res);

      // Should not crash, cart should remain unchanged
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: { food123: 2 } }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Removed from Cart'
      });
    });

    test('should handle last item removal (empty cart)', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      const mockUser = {
        _id: 'user123',
        cartData: { food123: 1 }
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      await removeFromCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { cartData: {} }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Removed from Cart'
      });
    });

    test('should handle database errors', async () => {
      req.body = {
        userId: 'user123',
        itemId: 'food123'
      };

      mockUserModel.findById.mockRejectedValue(new Error('Database error'));

      await removeFromCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('getCart', () => {
    test('should return user cart data', async () => {
      req.body = {
        userId: 'user123'
      };

      const cartData = {
        food123: 2,
        food456: 1,
        food789: 3
      };

      const mockUser = {
        _id: 'user123',
        cartData: cartData
      };

      mockUserModel.findById.mockResolvedValue(mockUser);

      await getCart(req, res);

      expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cartData: cartData
      });
    });

    test('should return empty cart for new user', async () => {
      req.body = {
        userId: 'newuser123'
      };

      const mockUser = {
        _id: 'newuser123',
        cartData: {}
      };

      mockUserModel.findById.mockResolvedValue(mockUser);

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cartData: {}
      });
    });

    test('should handle user not found', async () => {
      req.body = {
        userId: 'nonexistent'
      };

      mockUserModel.findById.mockResolvedValue(null);

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });

    test('should handle database errors', async () => {
      req.body = {
        userId: 'user123'
      };

      mockUserModel.findById.mockRejectedValue(new Error('Database error'));

      await getCart(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error'
      });
    });
  });

  describe('Cart Business Logic', () => {
    test('should maintain cart integrity across operations', async () => {
      const userId = 'user123';
      const mockUser = {
        _id: userId,
        cartData: {}
      };

      // Add first item
      req.body = { userId, itemId: 'food123' };
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);
      await addToCart(req, res);

      // Simulate cart update
      mockUser.cartData = { food123: 1 };

      // Add same item again
      mockUserModel.findById.mockResolvedValue(mockUser);
      await addToCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenLastCalledWith(
        userId,
        { cartData: { food123: 2 } }
      );
    });

    test('should handle concurrent item additions', async () => {
      const userId = 'user123';
      const mockUser = {
        _id: userId,
        cartData: {}
      };

      mockUserModel.findById.mockResolvedValue(mockUser);
      mockUserModel.findByIdAndUpdate.mockResolvedValue(true);

      // Add multiple different items
      req.body = { userId, itemId: 'food123' };
      await addToCart(req, res);

      mockUser.cartData = { food123: 1 };
      req.body = { userId, itemId: 'food456' };
      await addToCart(req, res);

      mockUser.cartData = { food123: 1, food456: 1 };
      req.body = { userId, itemId: 'food789' };
      await addToCart(req, res);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenLastCalledWith(
        userId,
        { cartData: { food123: 1, food456: 1, food789: 1 } }
      );
    });
  });
});
