import foodModel from "../models/foodModel.js";

/**
 * Food Repository - Data Access Layer
 * Handles all database operations for Food entity
 */

class FoodRepository {
  /**
   * Create new food item
   * @param {Object} foodData - Food data
   * @returns {Promise<Object>} Created food item
   */
  async create(foodData) {
    try {
      const food = new foodModel(foodData);
      return await food.save();
    } catch (error) {
      throw new Error(`Database error creating food: ${error.message}`);
    }
  }

  /**
   * Find food by ID
   * @param {string} foodId - Food ID
   * @returns {Promise<Object|null>} Food object or null
   */
  async findById(foodId) {
    try {
      return await foodModel.findById(foodId);
    } catch (error) {
      throw new Error(`Database error finding food by ID: ${error.message}`);
    }
  }

  /**
   * Get all food items
   * @param {Object} filter - Optional filter
   * @returns {Promise<Array>} Array of food items
   */
  async findAll(filter = {}) {
    try {
      return await foodModel.find(filter);
    } catch (error) {
      throw new Error(`Database error finding all foods: ${error.message}`);
    }
  }

  /**
   * Find foods by category
   * @param {string} category - Food category
   * @returns {Promise<Array>} Array of food items
   */
  async findByCategory(category) {
    try {
      return await foodModel.find({ category });
    } catch (error) {
      throw new Error(`Database error finding foods by category: ${error.message}`);
    }
  }

  /**
   * Update food by ID
   * @param {string} foodId - Food ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated food or null
   */
  async update(foodId, updateData) {
    try {
      return await foodModel.findByIdAndUpdate(
        foodId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Database error updating food: ${error.message}`);
    }
  }

  /**
   * Delete food by ID
   * @param {string} foodId - Food ID
   * @returns {Promise<Object|null>} Deleted food or null
   */
  async delete(foodId) {
    try {
      return await foodModel.findByIdAndDelete(foodId);
    } catch (error) {
      throw new Error(`Database error deleting food: ${error.message}`);
    }
  }

  /**
   * Check if food exists
   * @param {string} foodId - Food ID
   * @returns {Promise<boolean>} True if exists
   */
  async exists(foodId) {
    try {
      const food = await this.findById(foodId);
      return !!food;
    } catch (error) {
      throw new Error(`Database error checking food existence: ${error.message}`);
    }
  }

  /**
   * Search foods by name
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching foods
   */
  async search(searchTerm) {
    try {
      return await foodModel.find({
        name: { $regex: searchTerm, $options: 'i' }
      });
    } catch (error) {
      throw new Error(`Database error searching foods: ${error.message}`);
    }
  }

  /**
   * Count total food items
   * @param {Object} filter - Optional filter
   * @returns {Promise<number>} Count
   */
  async count(filter = {}) {
    try {
      return await foodModel.countDocuments(filter);
    } catch (error) {
      throw new Error(`Database error counting foods: ${error.message}`);
    }
  }
}

// Export singleton instance
export default new FoodRepository();
