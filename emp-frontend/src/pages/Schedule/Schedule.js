import React, { useState, useEffect, useRef } from 'react';
import './Schedule.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import HeaderBanner from '../../components/HeaderBanner/HeaderBanner';
import { leadsAPI } from '../../utils/api';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('all'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [tempFilter, setTempFilter] = useState('all');
  const filterRef = useRef(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterDropdown]);

  const handleApplyFilter = () => {
    setFilterDateRange(tempFilter);
    setShowFilterDropdown(false);
  };

  // Fetch scheduled leads from backend
  useEffect(() => {
    const fetchScheduledLeads = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await leadsAPI.getScheduledLeads(1, 100, searchTerm);
        
        if (response.data.leads) {
          // Backend already filters for Scheduled only, just map the data
          const scheduledLeads = response.data.leads
            .map(lead => ({
              id: lead._id,
              name: lead.name,
              email: lead.email,
              phone: lead.email, // Mapped to email as per your request
              location: lead.location || 'N/A', // Mapped to location as per your request
              source: lead.source || 'Unknown',
              scheduledDate: lead.scheduledDate,
              type: lead.type,
            }))
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
          
          setSchedules(scheduledLeads);
        }
      } catch (err) {
        console.error('Error fetching scheduled leads:', err);
        setError('Failed to fetch scheduled leads');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledLeads();
  }, [searchTerm]);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.source.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesDateFilter = true;
    if (filterDateRange === 'today') {
      const today = new Date().toDateString();
      const scheduleDate = new Date(schedule.scheduledDate).toDateString();
      matchesDateFilter = today === scheduleDate;
    }

    return matchesSearch && matchesDateFilter;
  });

  const formatDateTime = (dateString, type = 'date') => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { month: '2-digit', day: '2-digit', year: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="schedule-container">
      {/* Header Banner */}
      <HeaderBanner title="Schedule" showBack={true} />

      <div className="schedule-main-content">
        {/* Search Bar Row */}
        <div className="search-filter-row">
          <div className="search-wrapper-new">
            <svg className="search-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-new"
            />
          </div>
          
          <div className="filter-dropdown-container" ref={filterRef}>
            <button 
              className="filter-icon-btn"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <svg className="filter-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
            </button>

            {showFilterDropdown && (
              <div className="schedule-filter-popup">
                <label className="filter-popup-label">Filter</label>
                <div className="filter-select-wrapper">
                  <select 
                    value={tempFilter} 
                    onChange={(e) => setTempFilter(e.target.value)}
                    className="filter-v2-select"
                  >
                    <option value="today">Today</option>
                    <option value="all">All</option>
                  </select>
                </div>
                <button className="filter-save-btn" onClick={handleApplyFilter}>Save</button>
              </div>
            )}
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Schedules List */}
        <div className="schedules-list-new">
          {loading ? (
            <div className="loading-center">
              <div className="loader"></div>
            </div>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule, index) => (
              <div key={schedule.id} className={`schedule-card-v2 ${index === 0 ? 'blue-card' : 'white-card'}`}>
                <div className="card-header-row">
                  <span className="schedule-source-text">{schedule.source}</span>
                  <div className="date-display">
                    <span className="date-label">Date</span>
                    <span className="date-value">{formatDateTime(schedule.scheduledDate)}</span>
                  </div>
                </div>

                <div className="phone-display">
                  <span className="phone-number">{schedule.phone}</span>
                </div>

                <div className="card-footer-info">
                  <div className="call-info">
                    <div className="location-icon-circle">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <span className="call-text">{schedule.location}</span>
                  </div>
                  <div className="user-info">
                    <div className="avatar">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <span className="user-name">{schedule.name}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-schedules-new">
              <p>No schedules found</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Schedule;
