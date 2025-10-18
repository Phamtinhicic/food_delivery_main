import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './Dashboard.css';

const Dashboard = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0
  });
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('week'); // week, month

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [chartPeriod, token]);

  const fetchDashboardData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersResponse = await axios.get(`${url}/api/order/list`, {
        headers: { token }
      });
      if (ordersResponse.data.success) {
        const orders = ordersResponse.data.data;
        calculateStats(orders);
        setRecentOrders(orders.slice(0, 5));
      }

      // Fetch products for top sellers
      const productsResponse = await axios.get(`${url}/api/food/list`);
      if (productsResponse.data.success) {
        // Mock top products (in real app, calculate from order items)
        const products = productsResponse.data.data.slice(0, 5).map((p, i) => ({
          ...p,
          sold: Math.floor(Math.random() * 100) + 20,
          revenue: p.price * (Math.floor(Math.random() * 100) + 20)
        }));
        setTopProducts(products);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    const today = new Date().toDateString();
    
    const todayOrders = orders.filter(o => 
      new Date(o.date).toDateString() === today
    );
    
    const todayRevenue = todayOrders
      .filter(o => o.status === 'Delivered')
      .reduce((sum, o) => sum + o.amount, 0);
    
    const completed = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;

    setStats({
      todayRevenue,
      totalOrders: orders.length,
      completedOrders: completed,
      cancelledOrders: cancelled
    });

    // Generate chart data
    generateChartData(orders);
  };

  const generateChartData = (orders) => {
    const days = chartPeriod === 'week' ? 7 : 30;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayOrders = orders.filter(o => 
        new Date(o.date).toDateString() === dateStr && o.status === 'Delivered'
      );
      
      const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0);
      
      data.push({
        label: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        value: revenue,
        orders: dayOrders.length
      });
    }
    
    setChartData(data);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending': return 'pending';
      case 'Preparing':
      case 'Food Processing': return 'preparing';
      case 'Delivering':
      case 'Out for delivery': return 'delivering';
      case 'Delivered': return 'completed';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xác nhận';
      case 'Preparing':
      case 'Food Processing': return 'Đang chuẩn bị';
      case 'Delivering':
      case 'Out for delivery': return 'Đang giao';
      case 'Delivered': return 'Hoàn thành';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="dashboard">
      <h1>📊 Dashboard - Tổng quan</h1>

      {/* Stats Cards */}
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon revenue">💰</div>
          </div>
          <div className="card-label">Doanh thu hôm nay</div>
          <div className="card-value">{formatCurrency(stats.todayRevenue)}</div>
          <div className="card-change positive">
            ↑ So với hôm qua
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon orders">📦</div>
          </div>
          <div className="card-label">Tổng đơn hàng</div>
          <div className="card-value">{stats.totalOrders}</div>
          <div className="card-change">
            Tất cả đơn hàng
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon completed">✓</div>
          </div>
          <div className="card-label">Đơn hoàn thành</div>
          <div className="card-value">{stats.completedOrders}</div>
          <div className="card-change positive">
            {((stats.completedOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% tỷ lệ thành công
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-icon cancelled">✕</div>
          </div>
          <div className="card-label">Đơn bị hủy</div>
          <div className="card-value">{stats.cancelledOrders}</div>
          <div className="card-change negative">
            {((stats.cancelledOrders / stats.totalOrders) * 100 || 0).toFixed(1)}% tỷ lệ hủy
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">📈 Biểu đồ doanh thu</h3>
          <div className="chart-filters">
            <button
              className={`filter-btn ${chartPeriod === 'week' ? 'active' : ''}`}
              onClick={() => setChartPeriod('week')}
            >
              7 ngày
            </button>
            <button
              className={`filter-btn ${chartPeriod === 'month' ? 'active' : ''}`}
              onClick={() => setChartPeriod('month')}
            >
              30 ngày
            </button>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="simple-bar-chart">
            {chartData.map((item, index) => (
              <div key={index} className="bar-item">
                <div
                  className="bar"
                  style={{
                    height: `${(item.value / maxChartValue) * 100}%`
                  }}
                  title={`${formatCurrency(item.value)} - ${item.orders} đơn`}
                >
                  <div className="bar-value">
                    {item.value > 0 ? `${(item.value / 1000).toFixed(0)}k` : '0'}
                  </div>
                </div>
                <div className="bar-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products">
        <h3>🏆 Món bán chạy nhất</h3>
        <div className="product-list">
          {topProducts.map((product, index) => (
            <div key={product._id} className="product-item">
              <div className="product-info">
                <div className={`product-rank rank-${index + 1}`}>
                  {index + 1}
                </div>
                <div className="product-details">
                  <div className="product-name">{product.name}</div>
                  <div className="product-category">{product.category}</div>
                </div>
              </div>
              <div className="product-stats">
                <div className="product-sold">{product.sold} đã bán</div>
                <div className="product-revenue">{formatCurrency(product.revenue)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3>🕒 Đơn hàng gần đây</h3>
        <div className="order-list">
          {recentOrders.map((order) => (
            <div key={order._id} className="order-item-card">
              <div className="order-info">
                <div className="order-id-time">
                  <strong>#{order._id?.slice(-6).toUpperCase()}</strong>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    {formatTime(order.date)}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#4b5563' }}>
                  {order.address?.firstName} {order.address?.lastName}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className={`order-status ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <strong style={{ fontSize: '16px' }}>
                  {formatCurrency(order.amount)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
