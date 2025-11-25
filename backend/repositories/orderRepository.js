import orderModel from "../models/orderModel.js";

/**
 * Order Repository - Data Access Layer
 * Handles all database operations for Order entity
 */

class OrderRepository {
  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  async create(orderData) {
    try {
      const newOrder = new orderModel(orderData);
      return await newOrder.save();
    } catch (error) {
      throw new Error(`Database error creating order: ${error.message}`);
    }
  }

  /**
   * Find order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} Order object or null
   */
  async findById(orderId) {
    try {
      return await orderModel.findById(orderId);
    } catch (error) {
      throw new Error(`Database error finding order by ID: ${error.message}`);
    }
  }

  /**
   * Find orders by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of orders
   */
  async findByUserId(userId) {
    try {
      return await orderModel.find({ userId });
    } catch (error) {
      throw new Error(`Database error finding orders by user: ${error.message}`);
    }
  }

  /**
   * Get all orders
   * @param {Object} filter - Optional filter
   * @returns {Promise<Array>} Array of orders
   */
  async findAll(filter = {}) {
    try {
      return await orderModel.find(filter);
    } catch (error) {
      throw new Error(`Database error finding all orders: ${error.message}`);
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object|null>} Updated order or null
   */
  async updateStatus(orderId, status) {
    try {
      return await orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Database error updating order status: ${error.message}`);
    }
  }

  /**
   * Update order payment status
   * @param {string} orderId - Order ID
   * @param {boolean} payment - Payment status
   * @returns {Promise<Object|null>} Updated order or null
   */
  async updatePayment(orderId, payment) {
    try {
      return await orderModel.findByIdAndUpdate(
        orderId,
        { payment },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Database error updating payment status: ${error.message}`);
    }
  }

  /**
   * Update entire order
   * @param {string} orderId - Order ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated order or null
   */
  async update(orderId, updateData) {
    try {
      return await orderModel.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Database error updating order: ${error.message}`);
    }
  }

  /**
   * Delete order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} Deleted order or null
   */
  async delete(orderId) {
    try {
      return await orderModel.findByIdAndDelete(orderId);
    } catch (error) {
      throw new Error(`Database error deleting order: ${error.message}`);
    }
  }

  /**
   * Find orders by status
   * @param {string} status - Order status
   * @returns {Promise<Array>} Array of orders
   */
  async findByStatus(status) {
    try {
      return await orderModel.find({ status });
    } catch (error) {
      throw new Error(`Database error finding orders by status: ${error.message}`);
    }
  }

  /**
   * Find pending orders
   * @returns {Promise<Array>} Array of pending orders
   */
  async findPending() {
    try {
      return await orderModel.find({ 
        status: { $in: ['Food Processing', 'Out for delivery'] }
      });
    } catch (error) {
      throw new Error(`Database error finding pending orders: ${error.message}`);
    }
  }

  /**
   * Get order statistics by user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Statistics
   */
  async getStatsByUser(userId) {
    try {
      const total = await orderModel.countDocuments({ userId });
      const completed = await orderModel.countDocuments({ 
        userId, 
        status: 'Delivered' 
      });
      const pending = await orderModel.countDocuments({ 
        userId, 
        status: { $ne: 'Delivered' }
      });
      
      return { total, completed, pending };
    } catch (error) {
      throw new Error(`Database error getting order stats: ${error.message}`);
    }
  }

  /**
   * Count orders
   * @param {Object} filter - Optional filter
   * @returns {Promise<number>} Count
   */
  async count(filter = {}) {
    try {
      return await orderModel.countDocuments(filter);
    } catch (error) {
      throw new Error(`Database error counting orders: ${error.message}`);
    }
  }

  /**
   * Check if order exists
   * @param {string} orderId - Order ID
   * @returns {Promise<boolean>} True if exists
   */
  async exists(orderId) {
    try {
      const order = await this.findById(orderId);
      return !!order;
    } catch (error) {
      throw new Error(`Database error checking order existence: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new OrderRepository();
