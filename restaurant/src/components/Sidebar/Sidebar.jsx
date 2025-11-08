import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-section-title">MAIN MENU</div>
      <div className="sidebar-options">
        <NavLink to='/orders' className="sidebar-option">
          <span>🍽️</span>
          <p>Order Management</p>
        </NavLink>
        
        <NavLink to='/menu' className="sidebar-option">
          <span>🍴</span>
          <p>Menu Management</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
