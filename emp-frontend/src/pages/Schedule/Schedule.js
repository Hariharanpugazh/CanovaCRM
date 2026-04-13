import React, { useState, useEffect } from 'react';
import './Schedule.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // TODO: Fetch from backend
    // Mock schedule data
    setSchedules([
      {
        id: 1,
        type: 'Referral',
        number: '888-555-8888',
        name: 'Brooklyn Williamson',
        date: '10/04/25',
        callType: 'Call',
      },
      {
        id: 2,
        type: 'Referral',
        number: '365-555-8844',
        name: 'Jiu Wilkinson',
        date: '10/04/26',
        callType: 'Call',
      },
      {
        id: 3,
        type: 'Cold call',
        number: '844-888-8888',
        name: 'Jerry Alexander',
        date: '10/24/25',
        callType: 'Call',
      },
    ]);
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.number.includes(searchTerm) ||
      schedule.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === 'all' || schedule.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="schedule-container">
      <div className="schedule-content">
        {/* Header */}
        <div className="schedule-header">
          <h1 className="schedule-title">Schedule</h1>
        </div>

        {/* Search */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Options */}
        <div className="filter-section">
          <button
            className={`filter-option ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`filter-option ${filterType === 'referral' ? 'active' : ''}`}
            onClick={() => setFilterType('referral')}
          >
            Referral
          </button>
          <button
            className={`filter-option ${filterType === 'cold call' ? 'active' : ''}`}
            onClick={() => setFilterType('cold call')}
          >
            Cold Call
          </button>
        </div>

        {/* Schedules List */}
        <div className="schedules-list">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="schedule-card">
                <div className="schedule-type-badge">{schedule.type}</div>

                <div className="schedule-info">
                  <div className="info-row">
                    <span className="info-label">From</span>
                    <span className="info-value">{schedule.type}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Number</span>
                    <span className="info-value">{schedule.number}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Call</span>
                    <span className="info-value">{schedule.callType}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Name</span>
                    <span className="info-value">{schedule.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Schedule Date</span>
                    <span className="info-value">{schedule.date}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-schedules">
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
