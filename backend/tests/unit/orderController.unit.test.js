/**
 * Optimized Order Controller Unit Tests
 */

import { jest } from '@jest/globals';

const mockOrderRepository = {
  create: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  updateStatus: jest.fn(),
  findById: jest.fn(),
  update: jest.fn()
};

const mockUserRepository = {
  findById: jest.fn(),
  updateCart: jest.fn()
};

jest.unstable_mockModule('../../repositories/orderRepository.js', () => ({ default: mockOrderRepository }));
jest.unstable_mockModule('../../repositories/userRepository.js', () => ({ default: mockUserRepository }));

const { userOrders, listOrders, updateStatus } = await import('../../controllers/orderController.js');

describe('Order Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = { json: jest.fn() };
  });

  test('gets user orders', async () => {
    req.body = { userId: 'user123' };
    const mockOrders = [
      { _id: 'order1', amount: 50, status: 'Delivered' },
      { _id: 'order2', amount: 30, status: 'Food Processing' }
    ];
    mockOrderRepository.findByUserId.mockResolvedValue(mockOrders);

    await userOrders(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: mockOrders });
  });

  test('admin can list all orders', async () => {
    req.body = { userId: 'admin123' };
    mockUserRepository.findById.mockResolvedValue({ role: 'admin' });
    mockOrderRepository.findAll.mockResolvedValue([{ _id: 'order1' }, { _id: 'order2' }]);

    await listOrders(req, res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: expect.any(Array) });
  });

  test('user cannot list all orders', async () => {
    req.body = { userId: 'user123' };
    mockUserRepository.findById.mockResolvedValue({ role: 'user' });

    await listOrders(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  test('admin can update order status', async () => {
    req.body = { userId: 'admin123', orderId: 'order123', status: 'Out for delivery' };
    mockUserRepository.findById.mockResolvedValue({ role: 'admin' });

    await updateStatus(req, res);

    expect(mockOrderRepository.updateStatus).toHaveBeenCalledWith('order123', 'Out for delivery');
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });
});
