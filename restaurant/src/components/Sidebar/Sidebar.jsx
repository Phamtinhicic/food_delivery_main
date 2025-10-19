import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-section-title">MÀN HÌNH CHÍNH</div>
      <div className="sidebar-options">
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
    </div>
  );
};

export default Sidebar;
