import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './MenuManagement.css';

const MenuManagement = ({ url }) => {
  const [foodList, setFoodList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [localAvailability, setLocalAvailability] = useState({});
  const navigate = useNavigate();

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
      toast.error('Không thể tải danh sách món ăn');
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

  // Toggle food availability (local state - can be synced with backend later)
  const toggleAvailability = (foodId, currentStatus) => {
    setLocalAvailability(prev => ({
      ...prev,
      [foodId]: !currentStatus
    }));
    
    toast.success(
      !currentStatus ? '✓ Món đã được bật' : '✕ Món đã được tắt (Hết hàng)',
      { autoClose: 2000 }
    );
  };

  const handleEdit = (foodId) => {
    navigate(`/add?id=${foodId}`);
  };

  const handleDelete = async (foodId, foodName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa món "${foodName}"?`)) {
      return;
    }

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success('Đã xóa món thành công');
        fetchFoodList();
      }
    } catch (error) {
      console.error('Error deleting food:', error);
      toast.error('Không thể xóa món');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="menu-management">
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <div className="empty-state-text">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-management">
      <div className="menu-header">
        <h1>🍴 Quản lý Thực đơn</h1>
        <button className="btn-add-new" onClick={() => navigate('/add')}>
          <span>➕</span> Thêm món mới
        </button>
      </div>

      {/* Category filters */}
      <div className="menu-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'All' ? '📋 Tất cả' : `🍽️ ${category}`}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      {filteredList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <div className="empty-state-text">
            {selectedCategory === 'All'
              ? 'Chưa có món ăn nào. Hãy thêm món mới!'
              : `Không có món nào trong danh mục "${selectedCategory}"`}
          </div>
          <button className="btn-add-new" onClick={() => navigate('/add')}>
            <span>➕</span> Thêm món mới
          </button>
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

                  <div className="menu-item-actions">
                    {/* Toggle On/Off - Most Important Button */}
                    <button
                      className={`action-btn toggle ${!isAvailable ? 'off' : ''}`}
                      onClick={() => toggleAvailability(food._id, isAvailable)}
                      title={isAvailable ? 'Tắt món (Hết hàng)' : 'Bật món'}
                    >
                      {isAvailable ? '✓ ON' : '✕ OFF'}
                    </button>

                    {/* Edit button */}
                    <button
                      className="action-btn edit"
                      onClick={() => handleEdit(food._id)}
                      title="Chỉnh sửa"
                    >
                      ✏️ Sửa
                    </button>

                    {/* Delete button */}
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(food._id, food.name)}
                      title="Xóa"
                    >
                      🗑️ Xóa
                    </button>
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
