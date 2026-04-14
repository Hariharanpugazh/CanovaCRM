import React, { useState, useEffect } from 'react';
import './Home.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import HeaderBanner from '../../components/HeaderBanner/HeaderBanner';
import { employeeAPI } from '../../utils/api';

function Home() {
  // Prefer full name stored at login, fall back to email local-part, then to generic label
  const rawName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || '';
  const userName = rawName
    ? // If stored as email, take local-part; if full name, use as-is. Then title-case it.
      rawName.includes('@')
        ? rawName.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : rawName.replace(/\b\w/g, c => c.toUpperCase())
    : 'Employee';
  
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [todayBreakStartTime, setTodayBreakStartTime] = useState(null);
  const [todayBreakEndTime, setTodayBreakEndTime] = useState(null);
  const [breakLogs, setBreakLogs] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch today's attendance and break logs on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get today's attendance
        const attendanceResponse = await employeeAPI.getTodayAttendance();
        if (attendanceResponse.data) {
          setCheckInTime(attendanceResponse.data.checkInTime);
          setCheckOutTime(attendanceResponse.data.checkOutTime);
          setIsBreakActive(attendanceResponse.data.isBreakActive);
          setTodayBreakStartTime(attendanceResponse.data.todayBreakStartTime);
          setTodayBreakEndTime(attendanceResponse.data.todayBreakEndTime);
        }

        // Get break logs
        const breakLogsResponse = await employeeAPI.getBreakLogs();
        if (breakLogsResponse.data.breakLogs) {
          setBreakLogs(breakLogsResponse.data.breakLogs);
        }

        // Get recent activities
        const activitiesResponse = await employeeAPI.getRecentActivities();
        if (activitiesResponse.data.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCheckIn = async () => {
    try {
      const response = await employeeAPI.checkIn();
      if (response.data.checkInTime) {
        setCheckInTime(response.data.checkInTime);
        // Refresh activities
        const activitiesResponse = await employeeAPI.getRecentActivities();
        if (activitiesResponse.data.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      }
    } catch (err) {
      alert('Failed to check in: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckOut = async () => {
    try {
      // If break is still active, automatically end it first
      if (isBreakActive) {
        await employeeAPI.endBreak();
        setIsBreakActive(false);
      }

      const response = await employeeAPI.checkOut();
      if (response.data.checkOutTime) {
        setCheckOutTime(response.data.checkOutTime);
        // Refresh activities
        const activitiesResponse = await employeeAPI.getRecentActivities();
        if (activitiesResponse.data.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      }
    } catch (err) {
      alert('Failed to check out: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleBreakToggle = async () => {
    try {
      if (!isBreakActive) {
        // Start break
        await employeeAPI.startBreak();
        setIsBreakActive(true);
        
        // Immediately fetch break start time
        const attendanceResponse = await employeeAPI.getTodayAttendance();
        if (attendanceResponse.data) {
          setTodayBreakStartTime(attendanceResponse.data.todayBreakStartTime);
        }
        
        // Refresh activities
        const activitiesResponse = await employeeAPI.getRecentActivities();
        if (activitiesResponse.data.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      } else {
        // End break
        await employeeAPI.endBreak();
        setIsBreakActive(false);
        
        // Refresh all data
        const attendanceResponse = await employeeAPI.getTodayAttendance();
        if (attendanceResponse.data) {
          setTodayBreakStartTime(attendanceResponse.data.todayBreakStartTime);
          setTodayBreakEndTime(attendanceResponse.data.todayBreakEndTime);
        }
        
        const breakLogsResponse = await employeeAPI.getBreakLogs();
        if (breakLogsResponse.data.breakLogs) {
          setBreakLogs(breakLogsResponse.data.breakLogs);
        }
        
        const activitiesResponse = await employeeAPI.getRecentActivities();
        if (activitiesResponse.data.activities) {
          setRecentActivities(activitiesResponse.data.activities);
        }
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:-- __';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Determine indicator states
  const getCheckInIndicator = () => {
    if (checkInTime && checkOutTime) return 'completed'; // Red - day completed
    if (checkInTime && !checkOutTime) return 'active'; // Green - checked in
    return 'pending'; // White - not checked in
  };

  const getBreakIndicator = () => {
    if (isBreakActive) return 'active'; // Green - break in progress
    if (todayBreakEndTime) return 'completed'; // Red - break completed
    return 'pending'; // White - no break yet
  };

  // Handle Indicator Clicks
  const handleIndicatorClick = () => {
    if (!checkInTime) {
      handleCheckIn();
    } else if (!checkOutTime) {
      handleCheckOut();
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <HeaderBanner title={userName} subtitle="Good Morning" />
        <div className="home-content">
          <div className="loading-state">Loading...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="home-container">
      <HeaderBanner 
        title={userName}
        subtitle="Good Morning"
      />
      
      <div className="home-content">
        {error && <div className="error-banner">{error}</div>}

        <div className="timings-container">
          <h3 className="card-title">Timings</h3>
          
          <div className="timings-row">
            <div className="timing-column">
              <div className="timing-label">Checked-In</div>
              <div className="timing-display">
                {checkInTime ? formatTime(checkInTime) : '--:-- __'}
              </div>
            </div>

            <div className="timing-column">
              <div className="timing-label">Check Out</div>
              <div className="timing-display">
                {checkOutTime ? formatTime(checkOutTime) : '--:-- __'}
              </div>
            </div>

            <button 
              className={`indicator-btn ${getCheckInIndicator()}`}
              onClick={handleIndicatorClick}
              disabled={checkInTime && checkOutTime}
            >
              <div className="indicator-pill-inner"></div>
            </button>
          </div>

          {/* Break Section */}
          <div className="break-row">
            <div className="break-column">
              <div className="break-label">Break</div>
              <div className="timing-display">
                {todayBreakStartTime ? formatTime(todayBreakStartTime) : '--:-- __'}
              </div>
            </div>

            <div className="break-column">
              <div className="break-label">Ended</div>
              <div className="timing-display">
                {isBreakActive ? '--:-- __' : (todayBreakEndTime ? formatTime(todayBreakEndTime) : '--:-- __')}
              </div>
            </div>

            <button 
              className={`indicator-btn ${getBreakIndicator()}`}
              onClick={!checkOutTime ? handleBreakToggle : undefined}
              disabled={!!checkOutTime}
            >
              <div className="indicator-pill-inner"></div>
            </button>
          </div>

          {/* Break Logs INSIDE timings-container */}
          {breakLogs.length > 0 && (
            <div className="break-logs-section">
              <div className="break-logs-table">
                {breakLogs.map((log, index) => (
                  <div key={index}>
                    <div className="break-log-header">
                      <span>Break</span>
                      <span>Ended</span>
                      <span>Date</span>
                    </div>
                    <div className="break-log-row">
                      <span className="log-value">{log.startTime}</span>
                      <span className="log-value">{log.endTime}</span>
                      <span className="log-value">{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="activity-card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="activity-scroll-container">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-bullet">•</span>
                  <div className="activity-text">
                    <p className="activity-message">
                      {activity.message} <span className="activity-time">— {activity.time}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-activities">No recent activities</p>
            )}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Home;
