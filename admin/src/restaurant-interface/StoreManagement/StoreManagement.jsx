import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StoreManagement.css';

const StoreManagement = ({ url }) => {
  const [storeOpen, setStoreOpen] = useState(true);
  const [storeInfo, setStoreInfo] = useState({
    name: 'Nhà hàng Food Delivery',
    address: '',
    phone: '',
    email: '',
    description: ''
  });
  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '08:00', close: '22:00', closed: false },
    tuesday: { open: '08:00', close: '22:00', closed: false },
    wednesday: { open: '08:00', close: '22:00', closed: false },
    thursday: { open: '08:00', close: '22:00', closed: false },
    friday: { open: '08:00', close: '22:00', closed: false },
    saturday: { open: '08:00', close: '23:00', closed: false },
    sunday: { open: '09:00', close: '22:00', closed: false }
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayOrders: 0,
    activeMenuItems: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStoreData();
    fetchStats();
  }, []);

  const fetchStoreData = async () => {
    try {
      // In a real app, fetch from backend
      // For now, use localStorage or default values
      const savedInfo = localStorage.getItem('storeInfo');
      const savedHours = localStorage.getItem('operatingHours');
      const savedStatus = localStorage.getItem('storeOpen');

      if (savedInfo) setStoreInfo(JSON.parse(savedInfo));
      if (savedHours) setOperatingHours(JSON.parse(savedHours));
      if (savedStatus !== null) setStoreOpen(JSON.parse(savedStatus));
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch from backend
      const ordersResponse = await axios.get(`${url}/api/order/list`);
      const foodsResponse = await axios.get(`${url}/api/food/list`);

      if (ordersResponse.data.success) {
        const orders = ordersResponse.data.data;
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => 
          new Date(o.date).toDateString() === today
        );
        const todayRevenue = todayOrders
          .filter(o => o.status === 'Delivered')
          .reduce((sum, o) => sum + o.amount, 0);

        setStats(prev => ({
          ...prev,
          todayOrders: todayOrders.length,
          totalRevenue: todayRevenue
        }));
      }

      if (foodsResponse.data.success) {
        const activeFoods = foodsResponse.data.data.filter(f => f.available !== false);
        setStats(prev => ({
          ...prev,
          activeMenuItems: activeFoods.length
        }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStoreToggle = () => {
    const newStatus = !storeOpen;
    setStoreOpen(newStatus);
    localStorage.setItem('storeOpen', JSON.stringify(newStatus));
    
    toast.success(
      newStatus ? '✅ Cửa hàng đã mở!' : '🔒 Cửa hàng tạm đóng cửa',
      { autoClose: 2000 }
    );
  };

  const handleInfoChange = (e) => {
    setStoreInfo({
      ...storeInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleHoursChange = (day, field, value) => {
    setOperatingHours({
      ...operatingHours,
      [day]: {
        ...operatingHours[day],
        [field]: value
      }
    });
  };

  const handleSaveInfo = () => {
    setLoading(true);
    
    // Save to localStorage (in real app, save to backend)
    localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
    
    setTimeout(() => {
      setLoading(false);
      toast.success('✅ Đã lưu thông tin cửa hàng');
    }, 500);
  };

  const handleSaveHours = () => {
    setLoading(true);
    
    // Save to localStorage (in real app, save to backend)
    localStorage.setItem('operatingHours', JSON.stringify(operatingHours));
    
    setTimeout(() => {
      setLoading(false);
      toast.success('✅ Đã lưu giờ hoạt động');
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const dayNames = {
    monday: 'Thứ 2',
    tuesday: 'Thứ 3',
    wednesday: 'Thứ 4',
    thursday: 'Thứ 5',
    friday: 'Thứ 6',
    saturday: 'Thứ 7',
    sunday: 'Chủ nhật'
  };

  return (
    <div className="store-management">
      <h1>🏪 Quản lý Cửa hàng</h1>

      {/* Stats Banner */}
      <div className="stats-banner">
        <div className="stat-box">
          <div className="stat-box-value">{stats.todayOrders}</div>
          <div className="stat-box-label">Đơn hôm nay</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value">{stats.activeMenuItems}</div>
          <div className="stat-box-label">Món đang bán</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-value">
            {(stats.totalRevenue / 1000000).toFixed(1)}M
          </div>
          <div className="stat-box-label">Doanh thu hôm nay</div>
        </div>
      </div>

      <div className="store-sections">
        {/* Store Status Section */}
        <div className="store-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon status">🔔</div>
              <span>Trạng thái cửa hàng</span>
            </div>
          </div>

          <div className="status-toggle">
            <div className="status-info">
              <div className="status-label">
                {storeOpen ? 'Cửa hàng đang mở' : 'Tạm đóng cửa'}
              </div>
              <div className="status-description">
                {storeOpen 
                  ? 'Khách hàng có thể đặt hàng bình thường'
                  : 'Khách hàng không thể đặt hàng mới'}
              </div>
            </div>

            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={storeOpen}
                onChange={handleStoreToggle}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className={`status-badge ${storeOpen ? 'open' : 'closed'}`}>
            {storeOpen ? '✓ Đang mở cửa' : '✕ Đã đóng cửa'}
          </div>
        </div>

        {/* Operating Hours Section */}
        <div className="store-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon hours">⏰</div>
              <span>Giờ hoạt động</span>
            </div>
            <button
              className="btn-save"
              onClick={handleSaveHours}
              disabled={loading}
            >
              💾 Lưu giờ hoạt động
            </button>
          </div>

          <div className="hours-grid">
            {Object.entries(operatingHours).map(([day, hours]) => (
              <div key={day} className="hour-item">
                <div className="hour-day">{dayNames[day]}</div>
                <div className="hour-time">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Information Section */}
        <div className="store-section">
          <div className="section-header">
            <div className="section-title">
              <div className="section-icon info">ℹ️</div>
              <span>Thông tin cửa hàng</span>
            </div>
          </div>

          <div className="store-form">
            <div className="form-group">
              <label className="form-label">Tên nhà hàng</label>
              <input
                type="text"
                name="name"
                value={storeInfo.name}
                onChange={handleInfoChange}
                className="form-input"
                placeholder="Nhập tên nhà hàng"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={storeInfo.phone}
                  onChange={handleInfoChange}
                  className="form-input"
                  placeholder="0123 456 789"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={storeInfo.email}
                  onChange={handleInfoChange}
                  className="form-input"
                  placeholder="restaurant@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={storeInfo.address}
                onChange={handleInfoChange}
                className="form-input"
                placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả nhà hàng</label>
              <textarea
                name="description"
                value={storeInfo.description}
                onChange={handleInfoChange}
                className="form-input form-textarea"
                placeholder="Giới thiệu về nhà hàng của bạn..."
              />
            </div>

            <button
              className="btn-save"
              onClick={handleSaveInfo}
              disabled={loading}
            >
              💾 Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagement;
