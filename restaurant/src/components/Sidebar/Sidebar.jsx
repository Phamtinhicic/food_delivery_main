import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-section-title">Màn hình chính</div>
      <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option">
          <span>📊</span>
          <p>Dashboard</p>
        </NavLink>
        
        <NavLink to='/orders' className="sidebar-option">
          <span>🍽️</span>
          <p>Quản lý Đơn hàng</p>
        </NavLink>
        
        <NavLink to='/menu' className="sidebar-option">
          <span>🍴</span>
          <p>Quản lý Thực đơn</p>
        </NavLink>
        
        <NavLink to='/store' className="sidebar-option">
          <span>🏪</span>
          <p>Quản lý Cửa hàng</p>
        </NavLink>
      </div>
      
      <div className="sidebar-divider"></div>
      
      <div className="sidebar-section-title">Hệ thống</div>
      <div className="sidebar-options">
        <div className="sidebar-option">
          <span>⚙️</span>
          <p>Cài đặt</p>
        </div>
        
        <div className="sidebar-option">
          <span>🚪</span>
          <p>Đăng xuất</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
