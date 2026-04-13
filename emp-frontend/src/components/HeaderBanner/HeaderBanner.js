import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderBanner.css';
import BannerImage from '../../assets/Banner.svg';

const HeaderBanner = ({ title, subtitle, showBack = false, navigateTo }) => {
  const navigate = useNavigate();

  return (
    <div className="header-banner-container">
      <div className="banner-overlay-svg">
        <img src={BannerImage} alt="Banner Decor" />
      </div>
      
      <div className="header-top-logo">
        <span className="brand-logo">Canova<span className="brand-crm">CRM</span></span>
      </div>

      <div className="header-content-info">
        {showBack ? (
          <div className="header-back-title" onClick={() => navigateTo ? navigate(navigateTo) : navigate(-1)}>
            <svg className="back-arrow-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <h1 className="header-main-title">{title}</h1>
          </div>
        ) : (
          <div className="header-greeting-info">
            {subtitle && <p className="header-subtitle">{subtitle}</p>}
            <h1 className="header-main-title">{title}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBanner;
