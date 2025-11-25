import userModel from "../models/userModel.js";

/**
 * User Repository - Data Access Layer
 * Handles all database operations for User entity
 * Isolates Mongoose queries from business logic
 */

class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email) {
    try {
      return await userModel.findOne({ email });
    } catch (error) {
      throw new Error(`Database error finding user by email: ${error.message}`);
    }
  }

  /**
   * Find user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(userId) {
    try {
      return await userModel.findById(userId);
    } catch (error) {
      throw new Error(`Database error finding user by ID: ${error.message}`);
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data (name, email, password, role)
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    try {
      const newUser = new userModel(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Database error creating user: ${error.message}`);
    }
  }

  /**
   * Update user by ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  async update(userId, updateData) {
    try {
      return await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Database error updating user: ${error.message}`);
    }
  }

  /**
   * Update user role
   * @param {string} email - User email
   * @param {string} role - New role (admin/user)
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateRole(email, role) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;
      
      user.role = role;
      return await user.save();
    } catch (error) {
      throw new Error(`Database error updating user role: ${error.message}`);
    }
  }

  /**
   * Update user cart data
   * @param {string} userId - User ID
   * @param {Object} cartData - Cart data
   * @returns {Promise<Object|null>} Updated user or null
   */
  async updateCart(userId, cartData) {
    try {
      return await userModel.findByIdAndUpdate(
        userId,
        { cartData },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Database error updating cart: ${error.message}`);
    }
  }

  /**
   * Get user cart data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Cart data
   */
  async getCart(userId) {
    try {
      const user = await this.findById(userId);
      return user ? user.cartData : {};
    } catch (error) {
      throw new Error(`Database error getting cart: ${error.message}`);
    }
  }

  /**
   * Delete user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Deleted user or null
   */
  async delete(userId) {
    try {
      return await userModel.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Database error deleting user: ${error.message}`);
    }
  }

  /**
   * Check if user exists by email
   * @param {string} email - User email
   * @returns {Promise<boolean>} True if exists
   */
  async exists(email) {
    try {
      const user = await this.findByEmail(email);
      return !!user;
    } catch (error) {
      throw new Error(`Database error checking user existence: ${error.message}`);
    }
  }

  /**
   * Get all users (admin only)
   * @param {Object} filter - Optional filter
   * @returns {Promise<Array>} Array of users
   */
  async findAll(filter = {}) {
    try {
      return await userModel.find(filter).select('-password');
    } catch (error) {
      throw new Error(`Database error finding all users: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new UserRepository();
