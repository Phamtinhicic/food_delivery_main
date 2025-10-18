import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [storeOpen, setStoreOpen] = useState(true);

  useEffect(() => {
    // Load store status from localStorage
    const savedStatus = localStorage.getItem('storeOpen');
    if (savedStatus !== null) {
      setStoreOpen(JSON.parse(savedStatus));
    }
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          🍽️ Restaurant Panel
        </div>
        <div>
          <div className="navbar-title">Giao diện Nhà hàng</div>
          <div className="navbar-subtitle">Quản lý đơn hàng & thực đơn</div>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className={`navbar-status ${storeOpen ? 'open' : 'closed'}`}>
          {storeOpen ? '✓ Đang mở cửa' : '✕ Đã đóng cửa'}
        </div>
        
        <div className="navbar-profile">
          <div className="navbar-avatar">👨‍🍳</div>
          <div className="navbar-user-info">
            <div className="navbar-username">Restaurant Admin</div>
            <div className="navbar-role">Nhà hàng</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
