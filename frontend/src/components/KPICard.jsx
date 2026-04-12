import React from 'react';
import './KPICard.css';

const getIconSVG = (type) => {
  const icons = {
    unassigned: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"></path>
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    assigned: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1v22m11-11H1"></path>
      </svg>
    ),
    people: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    target: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="12" r="5"></circle>
        <circle cx="12" cy="12" r="9"></circle>
      </svg>
    )
  };
  return icons[type] || icons.unassigned;
};

const KPICard = ({ title, value, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon-wrapper">
        {typeof icon === 'string' ? getIconSVG(icon) : icon}
      </div>
      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-value">{value}</div>
      </div>
    </div>
  );
};

export default KPICard;
