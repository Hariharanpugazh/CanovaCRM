import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

function BottomNavigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navigation">
      <Link to="/home" className={`nav-item ${isActive('/home') ? 'active' : ''}`}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/leads" className={`nav-item ${isActive('/leads') ? 'active' : ''}`}>
        <span className="nav-icon">👥</span>
        <span className="nav-label">Leads</span>
      </Link>
      <Link to="/schedule" className={`nav-item ${isActive('/schedule') ? 'active' : ''}`}>
        <span className="nav-icon">📅</span>
        <span className="nav-label">Schedule</span>
      </Link>
      <Link to="/profile" className={`nav-item ${isActive('/profile') ? 'active' : ''}`}>
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;
