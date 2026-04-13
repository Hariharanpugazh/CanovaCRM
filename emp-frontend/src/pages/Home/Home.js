import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import HeaderBanner from '../../components/HeaderBanner/HeaderBanner';

function Home() {
  const navigate = useNavigate();
  const userGreeting = "Good Morning";
  const userName = localStorage.getItem('userEmail') ? localStorage.getItem('userEmail').split('@')[0] : 'Employee';
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isBreak, setIsBreak] = useState(false);
  const [breakLogs, setBreakLogs] = useState([]);
  const [currentBreakStart, setCurrentBreakStart] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);

  useEffect(() => {
    // Load check-in/out times from localStorage
    const today = new Date().toDateString();
    const savedCheckIn = localStorage.getItem(`checkIn_${today}`);
    const savedCheckOut = localStorage.getItem(`checkOut_${today}`);
    
    if (savedCheckIn) setCheckInTime(new Date(savedCheckIn));
    if (savedCheckOut) setCheckOutTime(new Date(savedCheckOut));
    
    // Load break logs
    const savedBreakLogs = localStorage.getItem('breakLogs');
    if (savedBreakLogs) {
      setBreakLogs(JSON.parse(savedBreakLogs));
    }

    // TODO: Fetch from backend
    // Mock recent activities
    setRecentActivities([
      { id: 1, type: 'lead_assigned', message: 'You were assigned 3 new leads', time: '1 hour ago' },
      { id: 2, type: 'lead_status', message: 'Lead status updated to Closed', time: '2 hours ago' },
      { id: 3, type: 'employee_created', message: 'New employee was created', time: '1 day ago' },
      { id: 4, type: 'lead_assigned', message: 'You were assigned 1 new lead', time: '2 days ago' },
      { id: 5, type: 'lead_status', message: 'Lead status updated to Ongoing', time: '3 days ago' },
      { id: 6, type: 'break_logged', message: 'Break logged successfully', time: '4 days ago' },
      { id: 7, type: 'checkin_logged', message: 'Check-in time recorded', time: '5 days ago' },
    ]);

    // Mock assigned leads
    setAssignedLeads([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        assignedDate: '2024-04-10',
        status: 'Ongoing',
        type: 'Hot',
        scheduleTime: null,
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        assignedDate: '2024-04-09',
        status: 'Ongoing',
        type: 'Warm',
        scheduleTime: null,
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        assignedDate: '2024-04-08',
        status: 'Closed',
        type: 'Cold',
        scheduleTime: null,
      },
    ]);
  }, []);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now);
    const today = new Date().toDateString();
    localStorage.setItem(`checkIn_${today}`, now.toISOString());
  };

  const handleCheckOut = () => {
    const now = new Date();
    setCheckOutTime(now);
    const today = new Date().toDateString();
    localStorage.setItem(`checkOut_${today}`, now.toISOString());
  };

  const handleBreakToggle = () => {
    const now = new Date();
    if (!isBreak) {
      // Start break
      setCurrentBreakStart(now);
      setIsBreak(true);
    } else {
      // End break
      if (currentBreakStart) {
        const breakLog = {
          date: new Date().toLocaleDateString(),
          startTime: currentBreakStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          endTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        
        const updatedBreakLogs = [breakLog, ...breakLogs].slice(0, 4); // Keep last 4 days
        setBreakLogs(updatedBreakLogs);
        localStorage.setItem('breakLogs', JSON.stringify(updatedBreakLogs));
      }
      setIsBreak(false);
      setCurrentBreakStart(null);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'Not logged';
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="home-container">
      <HeaderBanner 
        title={userName}
        subtitle={userGreeting}
      />
      
      <div className="home-content">
        {/* Check-in/Check-out Section */}
        <div className="timings-card">
          <h3 className="card-title">Timings</h3>
          <div className="timing-buttons">
            <div className="timing-item">
              <span className="timing-label">Check-in</span>
              <div className={`timing-time ${checkInTime ? 'checked-in' : ''}`}>
                {formatTime(checkInTime)}
              </div>
              {!checkInTime && (
                <button className="btn btn-primary" onClick={handleCheckIn}>
                  Check In
                </button>
              )}
            </div>
            <div className="timing-item">
              <span className="timing-label">Check-out</span>
              <div className="timing-time">
                {formatTime(checkOutTime)}
              </div>
              {checkInTime && !checkOutTime && (
                <button className="btn btn-primary" onClick={handleCheckOut}>
                  Check Out
                </button>
              )}
            </div>
          </div>

          {/* Break Section */}
          <div className="break-section">
            <button
              className={`btn ${isBreak ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleBreakToggle}
            >
              {isBreak ? 'End Break' : 'Break'}
            </button>
            {isBreak && (
              <span className="break-indicator">
                <span className="indicator-dot"></span>
                Break in progress...
              </span>
            )}
          </div>
        </div>

        {/* Break Logs */}
        {breakLogs.length > 0 && (
          <div className="break-logs-card">
            <h3 className="card-title">Break Logs</h3>
            <div className="break-logs-list">
              {breakLogs.map((log, index) => (
                <div key={index} className="break-log-item">
                  <div className="break-log-info">
                    <span className="break-label">Break</span>
                    <span className="break-time">{log.startTime} pm</span>
                  </div>
                  <div className="break-log-info">
                    <span className="break-label">Ended</span>
                    <span className="break-time">{log.endTime} pm</span>
                  </div>
                  <div className="break-log-info">
                    <span className="break-label">Date</span>
                    <span className="break-time">{log.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="activity-card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="activity-list">
            {recentActivities.slice(0, 7).map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className="activity-bullet">•</span>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Leads Preview */}
        <div className="leads-preview-card">
          <div className="leads-header">
            <h3 className="card-title">Assigned Leads</h3>
            <button className="view-all-btn" onClick={() => navigate('/leads')}>
              View All
            </button>
          </div>
          <div className="leads-list">
            {assignedLeads.slice(0, 3).map((lead) => (
              <div key={lead.id} className="lead-item">
                <div className="lead-header">
                  <div className="lead-name">{lead.name}</div>
                  <span className={`status-badge status-${lead.status.toLowerCase()}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="lead-details">
                  <span className="lead-email">{lead.email}</span>
                  <span className={`type-badge type-${lead.type.toLowerCase()}`}>
                    {lead.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
}

export default Home;
