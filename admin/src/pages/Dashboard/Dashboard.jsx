import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalFoods: 0,
    totalUsers: 0,
    todayRevenue: 0,
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [topFoods, setTopFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await axios.get(`${url}/api/order/list`, {
        headers: { token: localStorage.getItem('token') }
      });
      
      // Fetch foods
      const foodsResponse = await axios.get(`${url}/api/food/list`);
      
      // Fetch users
      const usersResponse = await axios.get(`${url}/api/user/all`, {
        headers: { token: localStorage.getItem('token') }
      });

      if (ordersResponse.data.success && foodsResponse.data.success) {
        const orders = ordersResponse.data.data || [];
        const foods = foodsResponse.data.data || [];
        const users = usersResponse.data.success ? usersResponse.data.data || [] : [];

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayOrders = orders.filter(o => {
          const orderDate = new Date(o.date);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });

        const totalRevenue = orders
          .filter(o => o.status === 'Delivered')
          .reduce((sum, o) => sum + (o.amount || 0), 0);

        const todayRevenue = todayOrders
          .filter(o => o.status === 'Delivered')
          .reduce((sum, o) => sum + (o.amount || 0), 0);

        const pendingOrders = orders.filter(o => 
          o.status === 'Food Processing' || o.status === 'Preparing'
        ).length;

        const completedOrders = orders.filter(o => o.status === 'Delivered').length;

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalFoods: foods.length,
          totalUsers: users.length,
          todayRevenue,
          todayOrders: todayOrders.length,
          pendingOrders,
          completedOrders
        });

        // Recent orders (last 5)
        const sortedOrders = [...orders].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setRecentOrders(sortedOrders.slice(0, 5));

        // Top foods (most ordered)
        const foodCounts = {};
        orders.forEach(order => {
          order.items?.forEach(item => {
            if (!foodCounts[item.name]) {
              foodCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
            }
            foodCounts[item.name].count += item.quantity;
            foodCounts[item.name].revenue += item.price * item.quantity;
          });
        });

        const topFoodsList = Object.values(foodCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setTopFoods(topFoodsList);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Food Processing': return '#dc2626';
      case 'Preparing': return '#ea580c';
      case 'Out for delivery': return '#2563eb';
      case 'Delivered': return '#16a34a';
      case 'Cancelled': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard Tổng quan</h1>
        <button className="refresh-btn" onClick={fetchDashboardData}>
          🔄 Làm mới
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Tổng doanh thu</p>
            <h2 className="stat-value">{formatCurrency(stats.totalRevenue)}</h2>
            <p className="stat-sub">Từ {stats.completedOrders} đơn hoàn thành</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <p className="stat-label">Tổng đơn hàng</p>
            <h2 className="stat-value">{stats.totalOrders}</h2>
            <p className="stat-sub">{stats.pendingOrders} đơn đang xử lý</p>
          </div>
        </div>

        <div className="stat-card foods">
          <div className="stat-icon">🍔</div>
          <div className="stat-content">
            <p className="stat-label">Tổng món ăn</p>
            <h2 className="stat-value">{stats.totalFoods}</h2>
            <p className="stat-sub">Trong menu</p>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <p className="stat-label">Tổng khách hàng</p>
            <h2 className="stat-value">{stats.totalUsers}</h2>
            <p className="stat-sub">Người dùng đã đăng ký</p>
          </div>
        </div>
      </div>

      {/* Today Stats */}
      <div className="today-stats">
        <h2>📅 Thống kê hôm nay</h2>
        <div className="today-grid">
          <div className="today-card">
            <span className="today-label">Doanh thu</span>
            <span className="today-value">{formatCurrency(stats.todayRevenue)}</span>
          </div>
          <div className="today-card">
            <span className="today-label">Đơn hàng</span>
            <span className="today-value">{stats.todayOrders}</span>
          </div>
          <div className="today-card">
            <span className="today-label">Đơn chờ xử lý</span>
            <span className="today-value pending">{stats.pendingOrders}</span>
          </div>
          <div className="today-card">
            <span className="today-label">Đơn hoàn thành</span>
            <span className="today-value success">{stats.completedOrders}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Foods */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-section">
          <h2>🕐 Đơn hàng gần đây</h2>
          <div className="orders-list">
            {recentOrders.length === 0 ? (
              <p className="empty-message">Chưa có đơn hàng nào</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">#{order._id?.slice(-6).toUpperCase()}</span>
                    <span className="order-customer">
                      {order.address?.firstName} {order.address?.lastName}
                    </span>
                  </div>
                  <div className="order-details">
                    <span className="order-amount">{formatCurrency(order.amount)}</span>
                    <span 
                      className="order-status"
                      style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <span className="order-date">{formatDate(order.date)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Foods */}
        <div className="dashboard-section">
          <h2>🏆 Top món ăn bán chạy</h2>
          <div className="top-foods-list">
            {topFoods.length === 0 ? (
              <p className="empty-message">Chưa có dữ liệu</p>
            ) : (
              topFoods.map((food, index) => (
                <div key={food.name} className="top-food-item">
                  <div className="rank">{index + 1}</div>
                  <div className="food-info">
                    <span className="food-name">{food.name}</span>
                    <span className="food-count">{food.count} đã bán</span>
                  </div>
                  <span className="food-revenue">{formatCurrency(food.revenue)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
