/**
 * Optimized Cart Controller Unit Tests
 */

import { jest } from '@jest/globals';

const mockUserRepository = {
  getCart: jest.fn(),
  updateCart: jest.fn()
};

jest.unstable_mockModule('../../repositories/userRepository.js', () => ({ default: mockUserRepository }));

const { addToCart, removeFromCart, getCart } = await import('../../controllers/cartController.js');

describe('Cart Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = { json: jest.fn() };
  });

  test('adds item to cart', async () => {
    req.body = { userId: 'user123', itemId: 'food123' };
    mockUserRepository.getCart.mockResolvedValue({});

    await addToCart(req, res);

    expect(mockUserRepository.updateCart).toHaveBeenCalledWith('user123', { food123: 2 }); // Changed from 1 to 2 - will FAIL
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test('increments existing item quantity', async () => {
    req.body = { userId: 'user123', itemId: 'food123' };
    mockUserRepository.getCart.mockResolvedValue({ food123: 2 });

    await addToCart(req, res);

    expect(mockUserRepository.updateCart).toHaveBeenCalledWith('user123', { food123: 3 });
  });

  test('removes item from cart', async () => {
    req.body = { userId: 'user123', itemId: 'food123' };
    mockUserRepository.getCart.mockResolvedValue({ food123: 1 });

    await removeFromCart(req, res);

    expect(mockUserRepository.updateCart).toHaveBeenCalledWith('user123', {});
  });

  test('gets cart data', async () => {
    req.body = { userId: 'user123' };
    mockUserRepository.getCart.mockResolvedValue({ food123: 2, food456: 1 });

    await getCart(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      cartData: { food123: 2, food456: 1 }
    });
  });
});
