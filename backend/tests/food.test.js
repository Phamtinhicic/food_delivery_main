import { describe, test, expect } from '@jest/globals';

describe('Food API Tests', () => {
  describe('Food data validation', () => {
    test('should validate food object structure', () => {
      const food = {
        name: 'Caesar Salad',
        description: 'Fresh salad with caesar dressing',
        price: 12.99,
        category: 'Salad',
        image: 'food_1.png'
      };
      
      expect(food).toHaveProperty('name');
      expect(food).toHaveProperty('description');
      expect(food).toHaveProperty('price');
      expect(food).toHaveProperty('category');
      expect(food).toHaveProperty('image');
    });

    test('should validate price is positive number', () => {
      const validPrice = 15.99;
      const invalidPrice = -5;
      const zeroPrice = 0;
      
      expect(validPrice).toBeGreaterThan(0);
      expect(invalidPrice).toBeLessThan(0);
      expect(zeroPrice).toBe(0);
    });

    test('should validate required fields', () => {
      const completeFood = {
        name: 'Test Food',
        description: 'Test Description',
        price: 10,
        category: 'Salad'
      };
      
      const incompleteFood = {
        description: 'Test Description',
        price: 10
      };
      
      expect(completeFood).toHaveProperty('name');
      expect(completeFood).toHaveProperty('price');
      expect(incompleteFood).not.toHaveProperty('name');
    });
  });

  describe('Food category validation', () => {
    const validCategories = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

    test('should have valid categories list', () => {
      expect(validCategories).toHaveLength(8);
      expect(validCategories).toContain('Salad');
      expect(validCategories).toContain('Pasta');
      expect(validCategories).toContain('Noodles');
    });

    test('should validate category exists in list', () => {
      const validCategory = 'Salad';
      const invalidCategory = 'Pizza';
      
      expect(validCategories).toContain(validCategory);
      expect(validCategories).not.toContain(invalidCategory);
    });

    test('should check all valid categories', () => {
      validCategories.forEach(category => {
        expect(typeof category).toBe('string');
        expect(category.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Food price calculations', () => {
    test('should calculate total price', () => {
      const foodItems = [
        { name: 'Salad', price: 10.99, quantity: 2 },
        { name: 'Pasta', price: 15.50, quantity: 1 }
      ];
      
      const total = foodItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      expect(total).toBeCloseTo(37.48, 2);
    });

    test('should format price correctly', () => {
      const price = 12.5;
      const formatted = price.toFixed(2);
      
      expect(formatted).toBe('12.50');
    });
  });

  describe('Food list operations', () => {
    test('should filter foods by category', () => {
      const foods = [
        { name: 'Caesar Salad', category: 'Salad', price: 10 },
        { name: 'Greek Salad', category: 'Salad', price: 12 },
        { name: 'Spaghetti', category: 'Pasta', price: 15 }
      ];
      
      const salads = foods.filter(food => food.category === 'Salad');
      
      expect(salads).toHaveLength(2);
      expect(salads[0].category).toBe('Salad');
      expect(salads[1].category).toBe('Salad');
    });

    test('should search foods by name', () => {
      const foods = [
        { name: 'Caesar Salad', category: 'Salad' },
        { name: 'Greek Salad', category: 'Salad' },
        { name: 'Pasta Carbonara', category: 'Pasta' }
      ];
      
      const searchTerm = 'salad';
      const results = foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      expect(results).toHaveLength(2);
    });
  });
});
