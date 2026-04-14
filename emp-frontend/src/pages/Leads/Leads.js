import React, { useState, useEffect, useCallback, useRef } from 'react';
import { leadsAPI } from '../../utils/api';
import './Leads.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import HeaderBanner from '../../components/HeaderBanner/HeaderBanner';

function Leads() {
  const hasInitializedRef = useRef(false);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals/Overlays state
  const [showTypeSelector, setShowTypeSelector] = useState(null); // leadId
  const [showScheduleSelector, setShowScheduleSelector] = useState(null); // leadId
  const [showStatusSelector, setShowStatusSelector] = useState(null); // leadId
  const [tempSchedule, setTempSchedule] = useState({ date: '', time: '' });
  const [tempStatus, setTempStatus] = useState('Ongoing');
  const [updating, setUpdating] = useState(null);

  // eslint-disable-next-line
  const _ignore = [filterStatus, updating, setUpdating];

  // Fetch leads from backend
  const fetchLeads = useCallback(async (page = 1, status = '', search = '', showLoader = false) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError('');
      const response = await leadsAPI.getMyLeads(page, 10, status, search);
      
      if (response.data.leads) {
        setLeads(response.data.leads);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.response?.data?.error || 'Failed to fetch leads');
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Initial fetch with loader
    const status = filterStatus === 'all' ? '' : filterStatus;
    fetchLeads(1, status, '', true);
    hasInitializedRef.current = true;
  }, [filterStatus, fetchLeads]);

  // Handle search with debounce
  useEffect(() => {
    if (!hasInitializedRef.current) return;

    const timer = setTimeout(() => {
      const status = filterStatus === 'all' ? '' : filterStatus;
      // Debounced fetch without full-page loader to keep typing smooth
      fetchLeads(1, status, searchTerm, false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, fetchLeads]);

  // Close modals when clicking outside (via backdrop OR escape key)
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setShowTypeSelector(null);
        setShowScheduleSelector(null);
        setShowStatusSelector(null);
      }
    };

    if (showTypeSelector || showScheduleSelector || showStatusSelector) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [showTypeSelector, showScheduleSelector, showStatusSelector]);

  const handleLeadTypeUpdate = async (leadId, newType) => {
    try {
      setUpdating(leadId);
      const response = await leadsAPI.updateLead(leadId, { type: newType });
      if (response.data.lead) {
        setLeads(leads.map(lead => lead._id === leadId ? response.data.lead : lead));
      }
      setShowTypeSelector(null);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to update lead type';
      alert(errorMsg);
    } finally {
      setUpdating(null);
    }
  };

  const handleScheduleSave = async (leadId) => {
    if (!tempSchedule.date || !tempSchedule.time) {
      alert('Please select both date and time');
      return;
    }
    try {
      setUpdating(leadId);
      const scheduledDateTime = `${tempSchedule.date}T${tempSchedule.time}`;
      const response = await leadsAPI.updateLead(leadId, { 
        type: 'Scheduled',
        scheduledDate: scheduledDateTime 
      });
      if (response.data.lead) {
        setLeads(leads.map(lead => lead._id === leadId ? response.data.lead : lead));
        setTempSchedule({ date: '', time: '' });
      }
      setShowScheduleSelector(null);
    } catch (err) {
      alert('Failed to schedule lead');
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusUpdate = async (leadId) => {
    try {
      setUpdating(leadId);
      const response = await leadsAPI.updateLead(leadId, { status: tempStatus });
      if (response.data.lead) {
        setLeads(leads.map(lead => lead._id === leadId ? response.data.lead : lead));
      }
      setShowStatusSelector(null);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="leads-container">
        <div className="leads-content loading-center">
          <div className="loader"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="leads-container">
      {/* Header Banner */}
      <HeaderBanner title="Leads" showBack={true} />
      
      {/* Modal Backdrop */}
      {(showTypeSelector || showScheduleSelector || showStatusSelector) && (
        <div 
          className="modal-backdrop" 
          onClick={(e) => {
            // Only close if clicking the backdrop itself, not bubbled from popups
            if (e.target === e.currentTarget) {
              setShowTypeSelector(null);
              setShowScheduleSelector(null);
              setShowStatusSelector(null);
            }
          }} 
        />
      )}

      <div className="leads-main-content">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
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
        </div>

        {error && <div className="error-banner">{error}</div>}

        {/* Leads Cards */}
        <div className="leads-list-new">
          {leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead._id} className="lead-card-new">
                <div className="lead-card-top">
                  <div className="lead-info-new">
                    <h3 className="lead-name-new">{lead.name}</h3>
                    <p className="lead-email-new">@{lead.email.split('@')[0]}@gmail.com</p>
                  </div>
                  
                  {/* Circular Status */}
                  <div className={`status-circle status-${lead.type?.toLowerCase() || 'warm'} ${lead.status === 'Closed' ? 'status-closed-bg' : ''}`}>
                    <span className="status-text">{lead.status}</span>
                    <svg className="progress-ring" width="70" height="70">
                      <circle
                        className="progress-ring-circle"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        r="32"
                        cx="35"
                        cy="35"
                      />
                    </svg>
                  </div>
                </div>

                <div className="lead-card-bottom">
                  <div className="lead-date-new">
                    <svg className="calendar-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {formatDate(lead.date)}
                  </div>
                  
                  <div className="lead-actions-new">
                    {/* Action 1: Type Selector */}
                    <div className="action-button-container">
                      <button 
                        className="action-icon-btn" 
                        title={lead.scheduledDate ? "Change priority (Hot/Warm/Cold) - Cannot set to Scheduled" : "Change priority type"}
                        onClick={() => {
                          setShowTypeSelector(showTypeSelector === lead._id ? null : lead._id);
                          setShowScheduleSelector(null);
                          setShowStatusSelector(null);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                      </button>
                      {showTypeSelector === lead._id && (
                        <div className="type-dropdown-v2" onClick={(e) => e.stopPropagation()}>
                          <label className="popup-label">Type</label>
                          <button onClick={() => handleLeadTypeUpdate(lead._id, 'Hot')} className="type-btn-v2 hot">Hot</button>
                          <button onClick={() => handleLeadTypeUpdate(lead._id, 'Warm')} className="type-btn-v2 warm">Warm</button>
                          <button onClick={() => handleLeadTypeUpdate(lead._id, 'Cold')} className="type-btn-v2 cold">Cold</button>
                        </div>
                      )}
                    </div>

                    {/* Action 2: Schedule (Clock) */}
                    <div className="action-button-container">
                      <button 
                        className="action-icon-btn"
                        onClick={() => {
                          setShowScheduleSelector(showScheduleSelector === lead._id ? null : lead._id);
                          setShowTypeSelector(null);
                          setShowStatusSelector(null);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                      </button>
                      {showScheduleSelector === lead._id && (
                        <div className="schedule-popover-v2" onClick={(e) => e.stopPropagation()}>
                          <label className="popup-label">Date</label>
                          <input 
                            type="date" 
                            className="popup-input"
                            onChange={(e) => setTempSchedule({...tempSchedule, date: e.target.value})}
                          />
                          <label className="popup-label">Time</label>
                          <input 
                            type="time" 
                            className="popup-input"
                            onChange={(e) => setTempSchedule({...tempSchedule, time: e.target.value})}
                          />
                          <button className="popup-save-btn" onClick={() => handleScheduleSave(lead._id)}>Save</button>
                        </div>
                      )}
                    </div>

                    {/* Action 3: Status Update (Arrow/Circle-Arrow) */}
                    <div className="action-button-container">
                      <button 
                        className="action-icon-btn"
                        onClick={() => {
                          setShowStatusSelector(showStatusSelector === lead._id ? null : lead._id);
                          setShowTypeSelector(null);
                          setShowScheduleSelector(null);
                          setTempStatus(lead.status);
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      
                      {showStatusSelector === lead._id && (
                        <div className="status-popover-v2" onClick={(e) => e.stopPropagation()}>
                          <div className="status-label-row">
                            <label className="popup-label">Lead Status</label>
                            <span className="info-icon" title="Lead cannot be closed if scheduled">ⓘ</span>
                            {lead.scheduledDate && (
                              <div className="status-tooltip">Lead can not be closed if scheduled</div>
                            )}
                          </div>
                          
                          <select 
                            className="popup-select"
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                            disabled={lead.scheduledDate ? true : false}
                          >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Closed">Closed</option>
                          </select>
                          
                          <button 
                            className="popup-save-btn" 
                            onClick={() => handleStatusUpdate(lead._id)}
                            disabled={lead.scheduledDate ? true : false}
                            style={lead.scheduledDate ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">No leads found</div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Leads;
