import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option">
          <span style={{ fontSize: '20px' }}>📊</span>
          <p>Dashboard</p>
        </NavLink>
        <NavLink to='/order-management' className="sidebar-option">
          <span style={{ fontSize: '20px' }}>🍽️</span>
          <p>Quản lý Đơn hàng</p>
        </NavLink>
        <NavLink to='/menu-management' className="sidebar-option">
          <span style={{ fontSize: '20px' }}>🍴</span>
          <p>Quản lý Thực đơn</p>
        </NavLink>
        <NavLink to='/store-management' className="sidebar-option">
          <span style={{ fontSize: '20px' }}>🏪</span>
          <p>Quản lý Cửa hàng</p>
        </NavLink>
        <div style={{ margin: '20px 0', borderTop: '1px solid #e5e7eb' }}></div>
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items (Old)</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items (Old)</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders (Old)</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
