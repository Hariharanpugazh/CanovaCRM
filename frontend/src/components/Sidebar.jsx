import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">Canova<span>CRM</span></h1>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
        >
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link
          to="/leads"
          className={`nav-item ${isActive('/leads') ? 'active' : ''}`}
        >
          <span className="nav-text">Leads</span>
        </Link>

        <Link
          to="/employees"
          className={`nav-item ${isActive('/employees') ? 'active' : ''}`}
        >
          <span className="nav-text">Employees</span>
        </Link>

        <Link
          to="/settings"
          className={`nav-item ${isActive('/settings') ? 'active' : ''}`}
        >
          <span className="nav-text">Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
