/**
 * Optimized Food Controller Unit Tests
 */

import { jest } from '@jest/globals';

const mockFoodRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  delete: jest.fn(),
  update: jest.fn()
};

const mockUserRepository = {
  findById: jest.fn()
};

const mockCloudinary = {
  uploader: { destroy: jest.fn() }
};

jest.unstable_mockModule('../../repositories/foodRepository.js', () => ({ default: mockFoodRepository }));
jest.unstable_mockModule('../../repositories/userRepository.js', () => ({ default: mockUserRepository }));
jest.unstable_mockModule('../../config/cloudinary.js', () => ({ cloudinary: mockCloudinary }));

const { listFood, removeFood } = await import('../../controllers/foodController.js');

describe('Food Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, file: null };
    res = { json: jest.fn() };
  });

  describe('List', () => {
    test('returns all foods', async () => {
      const mockFoods = [
        { _id: '1', name: 'Pizza', price: 12.99 },
        { _id: '2', name: 'Burger', price: 8.99 }
      ];
      mockFoodRepository.findAll.mockResolvedValue(mockFoods);

      await listFood(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockFoods
      });
    });

    test('TEST INTENTIONAL FAILURE - should detect failed test in Grafana', async () => {
      // This test will fail to verify Grafana dashboard shows failed tests
      throw new Error('❌ INTENTIONAL TEST FAILURE for Grafana monitoring verification');
    });

    test('handles empty list', async () => {
      mockFoodRepository.findAll.mockResolvedValue([]);

      await listFood(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
    });
  });

  describe('Remove', () => {
    test('rejects non-admin', async () => {
      req.body = { userId: 'user123', id: 'food123' };
      mockUserRepository.findById.mockResolvedValue({ role: 'user' });

      await removeFood(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('deletes food and cloudinary image', async () => {
      req.body = { userId: 'admin123', id: 'food123' };
      mockUserRepository.findById.mockResolvedValue({ role: 'admin' });
      mockFoodRepository.findById.mockResolvedValue({
        _id: 'food123',
        image: 'https://res.cloudinary.com/demo/image/upload/v123/food/pizza.jpg'
      });

      await removeFood(req, res);

      expect(mockCloudinary.uploader.destroy).toHaveBeenCalled();
      expect(mockFoodRepository.delete).toHaveBeenCalledWith('food123');
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });
});
