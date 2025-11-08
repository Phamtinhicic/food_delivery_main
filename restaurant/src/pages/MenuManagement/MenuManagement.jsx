import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './MenuManagement.css';

const MenuManagement = ({ url }) => {
  const [foodList, setFoodList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [localAvailability, setLocalAvailability] = useState({});

  useEffect(() => {
    fetchFoodList();
  }, []);

  useEffect(() => {
    filterByCategory();
  }, [selectedCategory, foodList]);

  const fetchFoodList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        const foods = response.data.data;
        setFoodList(foods);
        
        // Extract unique categories
        const cats = ['All', ...new Set(foods.map(f => f.category))];
        setCategories(cats);
      }
    } catch (error) {
      console.error('Error fetching food list:', error);
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = () => {
    if (selectedCategory === 'All') {
      setFilteredList(foodList);
    } else {
      setFilteredList(foodList.filter(f => f.category === selectedCategory));
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="menu-management">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-management">
      <div className="menu-header">
        <h1>🍴 Menu Management (View Only)</h1>
      </div>

      {/* Category filters */}
      <div className="menu-filters">
        <div className="filter-header">
          <span className="filter-label">Filter by category:</span>
          {selectedCategory !== 'All' && (
            <button 
              className="reset-filter-btn"
              onClick={() => setSelectedCategory('All')}
            >
              ✕ Clear filter
            </button>
          )}
        </div>
        <div className="filter-chips">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-chip ${selectedCategory === category ? 'active' : ''} ${category === 'All' ? 'all-category' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'All' ? '📋 All Items' : `🍽️ ${category}`}
              {selectedCategory === category && category !== 'All' && (
                <span className="active-indicator"> ✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      {filteredList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <div className="empty-state-text">
            {selectedCategory === 'All'
              ? 'No items in the system yet'
              : `No items in "${selectedCategory}" category`}
          </div>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredList.map((food) => {
            const isAvailable = localAvailability[food._id] ?? true;
            return (
              <div
                key={food._id}
                className={`menu-item-card ${!isAvailable ? 'out-of-stock' : ''}`}
              >
                <img
                  src={`${url}/images/${food.image}`}
                  alt={food.name}
                  className="menu-item-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/280x180?text=No+Image';
                  }}
                />
                
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <div className="menu-item-name">{food.name}</div>
                    <div className="menu-item-price">{formatCurrency(food.price)}</div>
                  </div>

                  <span className="menu-item-category">{food.category}</span>

                  <p className="menu-item-description">{food.description}</p>

                  {/* Read-only status display */}
                  <div className="menu-item-status">
                    <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                      {isAvailable ? '✓ Available' : '✕ Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
