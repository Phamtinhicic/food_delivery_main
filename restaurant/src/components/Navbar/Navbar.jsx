import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { restaurant, setRestaurant, token, setToken } = useContext(StoreContext);
  const [storeOpen, setStoreOpen] = useState(true);

  useEffect(() => {
    // Load store status from localStorage
    const savedStatus = localStorage.getItem('storeOpen');
    if (savedStatus !== null) {
      setStoreOpen(JSON.parse(savedStatus));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("restaurant");
    setToken("");
    setRestaurant(false);
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          🍽️ Restaurant Panel
        </div>
        <div>
          <div className="navbar-title">Restaurant Dashboard</div>
          <div className="navbar-subtitle">Manage Orders & Menu</div>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className={`navbar-status ${storeOpen ? 'open' : 'closed'}`}>
          {storeOpen ? '✓ Open' : '✕ Closed'}
        </div>
        
        <div className="navbar-profile">
          <div className="navbar-avatar">👨‍🍳</div>
          <div className="navbar-user-info">
            <div className="navbar-username">Restaurant Owner</div>
            <div className="navbar-role">Restaurant</div>
          </div>
        </div>
        
        {restaurant ? (
          <button className="navbar-logout" onClick={logout}>Logout</button>
        ) : (
          <button className="navbar-login" onClick={() => navigate("/")}>Login</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
