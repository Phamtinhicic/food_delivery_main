/**
 * Unit Tests for User Controller
 * Tests business logic with mocked dependencies
 */

import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Mock dependencies before importing controller
const mockUserModel = {
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
  prototype: {
    save: jest.fn()
  }
};

// Mock modules
jest.unstable_mockModule('../models/userModel.js', () => ({
  default: mockUserModel
}));

// Import controller after mocking
const { registerUser, loginUser, makeAdmin, createUserByAdmin, listAllUsers, deleteUserByAdmin } = await import('../controllers/userController.js');

describe('User Controller - Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response mocks
    req = {
      body: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Setup environment
    process.env.JWT_SECRET = 'test-secret';
    process.env.SALT = '10';
    process.env.ADMIN_SETUP_SECRET = 'admin-secret';
  });

  describe('registerUser', () => {
    test('should check if user exists', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      mockUserModel.findOne.mockResolvedValue(null);
      await registerUser(req, res);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    });

    test('should reject duplicate email', async () => {
      req.body = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockUserModel.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists'
      });
    });

    test('should reject invalid email format', async () => {
      req.body = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123'
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please enter valid email'
      });
    });

    test('should reject weak password (< 8 characters)', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'weak'
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await registerUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Please enter strong password'
      });
    });

    test('should hash password before saving', async () => {
      req.body = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      mockUserModel.findOne.mockResolvedValue(null);

      const bcryptGenSalt = jest.spyOn(bcrypt, 'genSalt');
      const bcryptHash = jest.spyOn(bcrypt, 'hash');

      await registerUser(req, res);

      expect(bcryptGenSalt).toHaveBeenCalled();
      expect(bcryptHash).toHaveBeenCalledWith('password123', expect.anything());
    });
  });

  describe('loginUser', () => {
    test('should login successfully with correct credentials', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        role: 'user'
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await loginUser(req, res);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          role: 'user'
        })
      );
    });

    test('should reject non-existent user', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User Doesn't exist"
      });
    });

    test('should reject wrong password', async () => {
      req.body = {
        email: 'john@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        email: 'john@example.com',
        password: '$2b$10$hashedpassword',
        role: 'user'
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid Credentials'
      });
    });

    test('should return user role with token', async () => {
      req.body = {
        email: 'admin@example.com',
        password: 'password123'
      };

      const mockAdmin = {
        _id: 'admin123',
        email: 'admin@example.com',
        password: '$2b$10$hashedpassword',
        role: 'admin'
      };

      mockUserModel.findOne.mockResolvedValue(mockAdmin);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: expect.any(String),
          role: 'admin'
        })
      );
    });
  });

  describe('makeAdmin', () => {
    test('should make user admin with correct secret', async () => {
      req.body = {
        email: 'user@example.com',
        secret: 'admin-secret'
      };

      const mockUser = {
        _id: 'user123',
        email: 'user@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };

      mockUserModel.findOne.mockResolvedValue(mockUser);

      await makeAdmin(req, res);

      expect(mockUser.role).toBe('admin');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'user@example.com is now admin'
      });
    });

    test('should reject without correct secret', async () => {
      req.body = {
        email: 'user@example.com',
        secret: 'wrong-secret'
      };

      await makeAdmin(req, res);

      expect(mockUserModel.findOne).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Unauthorized'
      });
    });

    test('should reject if user not found', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        secret: 'admin-secret'
      };

      mockUserModel.findOne.mockResolvedValue(null);

      await makeAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });

  describe('createUserByAdmin', () => {
    test('should check admin permissions', async () => {
      req.body = {
        userId: 'admin123',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'restaurant'
      };

      const mockAdmin = {
        _id: 'admin123',
        role: 'admin'
      };

      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockUserModel.findOne.mockResolvedValue(null);

      await createUserByAdmin(req, res);
      expect(mockUserModel.findById).toHaveBeenCalledWith('admin123');
    });

    test('should reject if requester is not admin', async () => {
      req.body = {
        userId: 'user123',
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const mockRegularUser = {
        _id: 'user123',
        role: 'user'
      };

      mockUserModel.findById.mockResolvedValue(mockRegularUser);

      await createUserByAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not admin'
      });
    });

    test('should reject duplicate email', async () => {
      req.body = {
        userId: 'admin123',
        name: 'New User',
        email: 'existing@example.com',
        password: 'password123'
      };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockUserModel.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await createUserByAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists'
      });
    });
  });

  describe('listAllUsers', () => {
    test('should allow admin to list all users', async () => {
      req.body = { userId: 'admin123' };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      const mockUsers = [
        { _id: 'user1', name: 'User 1', email: 'user1@example.com', role: 'user' },
        { _id: 'user2', name: 'User 2', email: 'user2@example.com', role: 'restaurant' }
      ];

      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockUserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      await listAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUsers
      });
    });

    test('should reject non-admin users', async () => {
      req.body = { userId: 'user123' };

      const mockUser = { _id: 'user123', role: 'user' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      await listAllUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not admin'
      });
    });
  });

  describe('deleteUserByAdmin', () => {
    test('should allow admin to delete user', async () => {
      req.body = {
        userId: 'admin123',
        id: 'user123'
      };

      const mockAdmin = { _id: 'admin123', role: 'admin' };
      mockUserModel.findById.mockResolvedValue(mockAdmin);
      mockUserModel.findByIdAndDelete.mockResolvedValue(true);

      await deleteUserByAdmin(req, res);

      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted'
      });
    });

    test('should reject non-admin users', async () => {
      req.body = {
        userId: 'user123',
        id: 'otheruser123'
      };

      const mockUser = { _id: 'user123', role: 'restaurant' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      await deleteUserByAdmin(req, res);

      expect(mockUserModel.findByIdAndDelete).not.toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'You are not admin'
      });
    });
  });
});
