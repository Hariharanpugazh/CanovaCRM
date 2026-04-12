import React from 'react';
import './KPICard.css';

import unassignedIcon from '../assets/unassigned.svg';
import assignedIcon from '../assets/assigned.svg';
import activeIcon from '../assets/active.svg';
import conversionIcon from '../assets/conversion.svg';

const KPICard = ({ title, value, icon }) => {
  const getIconSource = (type) => {
    const icons = {
      unassigned: unassignedIcon,
      assigned: assignedIcon,
      people: activeIcon,
      target: conversionIcon
    };
    return icons[type] || unassignedIcon;
  };

  return (
    <div className="kpi-card">
      <div className="kpi-icon-wrapper">
        <img src={getIconSource(icon)} alt={title} className="kpi-icon-img" />
      </div>
      <div className="kpi-content">
        <h3 className="kpi-title">{title}</h3>
        <div className="kpi-value">{value}</div>
      </div>
    </div>
  );
};

export default KPICard;
