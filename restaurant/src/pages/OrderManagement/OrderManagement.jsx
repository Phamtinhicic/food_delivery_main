import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import './OrderManagement.css';

const OrderManagement = ({ url }) => {
  const { token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  // Audio notification
  const audioRef = useRef(null);
  const [hasNewOrders, setHasNewOrders] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(`${url}/api/order/list`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        const newOrders = response.data.data;
        
        // Check for new pending orders
        const pendingOrders = newOrders.filter(o => o.status === 'Food Processing');
        const oldPendingOrders = orders.filter(o => o.status === 'Food Processing');
        
        if (pendingOrders.length > oldPendingOrders.length) {
          setHasNewOrders(true);
          playNotificationSound();
        }
        
        setOrders(newOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play error:', err));
    }
  };

  // Stop notification sound
  const stopNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setHasNewOrders(false);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: newStatus
      }, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success(`Đơn hàng đã được cập nhật: ${newStatus}`);
        fetchOrders();
        
        if (newStatus === 'Out for delivery') {
          stopNotificationSound();
        }
      } else {
        toast.error(response.data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật đơn hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle confirm order
  const handleConfirmOrder = (orderId) => {
    updateOrderStatus(orderId, 'Preparing');
  };

  // Handle ready for delivery
  const handleReadyOrder = (orderId) => {
    updateOrderStatus(orderId, 'Delivering');
  };

  // Handle cancel order
  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${url}/api/order/cancel`, {
        orderId: selectedOrder._id,
        reason: cancelReason
      });

      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy');
        fetchOrders();
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedOrder(null);
        stopNotificationSound();
      }
    } catch (error) {
      toast.error('Lỗi khi hủy đơn hàng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount and every 10 seconds
  useEffect(() => {
    if (token) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  // Group orders by status
  const groupedOrders = {
    Pending: orders.filter(o => o.status === 'Pending'),
    Preparing: orders.filter(o => o.status === 'Preparing' || o.status === 'Food Processing'),
    Delivering: orders.filter(o => o.status === 'Delivering' || o.status === 'Out for delivery'),
    Completed: orders.filter(o => o.status === 'Delivered'),
    Cancelled: orders.filter(o => o.status === 'Cancelled')
  };

  // Stats
  const stats = {
    total: orders.length,
    pending: groupedOrders.Pending.length,
    preparing: groupedOrders.Preparing.length,
    completed: groupedOrders.Completed.length
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Render order card
  const renderOrderCard = (order) => {
    return (
      <div
        key={order._id}
        className={`order-card ${order.status === 'Pending' ? 'new-order' : ''}`}
      >
        <div className="order-header">
          <span className="order-id">#{order._id?.slice(-6).toUpperCase()}</span>
          <span className="order-time">{formatTime(order.date)}</span>
        </div>

        <div className="order-customer">
          👤 {order.address?.firstName} {order.address?.lastName}
        </div>

        <div className="order-items">
          {order.items?.map((item, index) => (
            <div key={index} className="order-item">
              <span className="order-item-name">
                {item.quantity}x {item.name}
              </span>
              <span className="order-item-price">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {order.address?.note && (
          <div className="order-note">
            📝 Ghi chú: {order.address.note}
          </div>
        )}

        <div className="order-total">
          Tổng: {formatCurrency(order.amount)}
        </div>

        <div className="order-actions">
          {order.status === 'Pending' && (
            <>
              <button
                className="btn-action btn-confirm"
                onClick={() => handleConfirmOrder(order._id)}
                disabled={loading}
              >
                ✓ Xác nhận
              </button>
              <button
                className="btn-action btn-cancel"
                onClick={() => handleCancelClick(order)}
                disabled={loading}
              >
                ✕ Hủy
              </button>
            </>
          )}
          
          {(order.status === 'Preparing' || order.status === 'Food Processing') && (
            <button
              className="btn-action btn-ready"
              onClick={() => handleReadyOrder(order._id)}
              disabled={loading}
            >
              🚚 Sẵn sàng giao
            </button>
          )}
        </div>
      </div>
    );
  };

  // Render column
  const renderColumn = (title, status, className) => {
    const columnOrders = groupedOrders[status];
    
    return (
      <div className={`kanban-column column-${className}`}>
        <div className="column-header">
          <div className="column-title">{title}</div>
          <div className="column-count">{columnOrders.length}</div>
        </div>
        
        <div className="orders-container">
          {columnOrders.length > 0 ? (
            columnOrders.map(renderOrderCard)
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">Không có đơn hàng</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="order-management">
      {/* Hidden audio element for notification */}
      <audio ref={audioRef} loop>
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBStcuOfunl0SD0Cp4/G3YhoEOZHY8s18KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=" type="audio/wav" />
      </audio>

      <h1>🍽️ Quản lý Đơn hàng</h1>

      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-label">Đơn chờ xác nhận</div>
          <div className="stat-value" style={{ color: '#dc2626' }}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Đang chuẩn bị</div>
          <div className="stat-value" style={{ color: '#ea580c' }}>{stats.preparing}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hoàn thành</div>
          <div className="stat-value" style={{ color: '#16a34a' }}>{stats.completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng đơn</div>
          <div className="stat-value">{stats.total}</div>
        </div>
      </div>

      {/* Kanban board */}
      <div className="kanban-board">
        {renderColumn('🔔 Đơn mới', 'Pending', 'pending')}
        {renderColumn('👨‍🍳 Đang chuẩn bị', 'Preparing', 'preparing')}
        {renderColumn('🚚 Đang giao', 'Delivering', 'delivering')}
        {renderColumn('✅ Hoàn thành', 'Completed', 'completed')}
        {renderColumn('❌ Đã hủy', 'Cancelled', 'cancelled')}
      </div>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Hủy đơn hàng</h3>
            <textarea
              className="modal-input"
              rows="4"
              placeholder="Nhập lý do hủy đơn..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="modal-actions">
              <button
                className="btn-modal btn-modal-cancel"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
              >
                Đóng
              </button>
              <button
                className="btn-modal btn-modal-confirm"
                onClick={handleCancelConfirm}
                disabled={loading}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
