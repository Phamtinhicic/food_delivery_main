/**
 * Optimized User Controller Unit Tests
 * Tests business logic with mocked repository
 */

import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  exists: jest.fn(),
  create: jest.fn(),
  updateRole: jest.fn(),
  findAll: jest.fn(),
  delete: jest.fn()
};

jest.unstable_mockModule('../../repositories/userRepository.js', () => ({
  default: mockUserRepository
}));

const { registerUser, loginUser, makeAdmin, listAllUsers } = await import('../../controllers/userController.js');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = { json: jest.fn() };
    process.env.JWT_SECRET = 'test-secret';
    process.env.SALT = '10';
    process.env.ADMIN_SETUP_SECRET = 'admin-secret';
  });

  describe('Register', () => {
    test('rejects duplicate email', async () => {
      req.body = { name: 'John', email: 'existing@test.com', password: 'password123' };
      mockUserRepository.exists.mockResolvedValue(true);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('rejects invalid email', async () => {
      req.body = { name: 'John', email: 'invalid', password: 'password123' };
      mockUserRepository.exists.mockResolvedValue(false);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        success: false,
        message: 'Please enter valid email'
      }));
    });

    test('rejects weak password', async () => {
      req.body = { name: 'John', email: 'john@test.com', password: 'weak' };
      mockUserRepository.exists.mockResolvedValue(false);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        success: false,
        message: 'Please enter strong password'
      }));
    });

    test('creates user with valid data', async () => {
      req.body = { name: 'John', email: 'john@test.com', password: 'password123' };
      mockUserRepository.exists.mockResolvedValue(false);
      mockUserRepository.create.mockResolvedValue({
        _id: 'user123',
        role: 'user'
      });

      await registerUser(req, res);

      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: expect.any(String)
      }));
    });
  });

  describe('Login', () => {
    test('rejects non-existent user', async () => {
      req.body = { email: 'none@test.com', password: 'password123' };
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('rejects wrong password', async () => {
      req.body = { email: 'john@test.com', password: 'wrong' };
      mockUserRepository.findByEmail.mockResolvedValue({
        password: '$2b$10$hash',
        role: 'user'
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        success: false,
        message: 'Invalid Credentials'
      }));
    });

    test('logs in with correct credentials', async () => {
      req.body = { email: 'john@test.com', password: 'password123' };
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: 'user123',
        password: '$2b$10$hash',
        role: 'user'
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        token: expect.any(String)
      }));
    });
  });

  describe('Admin', () => {
    test('make admin rejects wrong secret', async () => {
      req.body = { email: 'user@test.com', secret: 'wrong' };

      await makeAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('make admin works with correct secret', async () => {
      req.body = { email: 'user@test.com', secret: 'admin-secret' };
      mockUserRepository.updateRole.mockResolvedValue({ role: 'admin' });

      await makeAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    test('list users rejects non-admin', async () => {
      req.body = { userId: 'user123' };
      mockUserRepository.findById.mockResolvedValue({ role: 'user' });

      await listAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });
});
