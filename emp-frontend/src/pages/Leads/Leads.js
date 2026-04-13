import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadsAPI } from '../../utils/api';
import './Leads.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';

function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ total: 0, pages: 0, currentPage: 1 });
  const [updating, setUpdating] = useState(null);
  
  // Modals/Overlays state
  const [showTypeSelector, setShowTypeSelector] = useState(null); // leadId
  const [showScheduleSelector, setShowScheduleSelector] = useState(null); // leadId
  const [showStatusSelector, setShowStatusSelector] = useState(null); // leadId
  const [tempSchedule, setTempSchedule] = useState({ date: '', time: '' });
  const [tempStatus, setTempStatus] = useState('Ongoing');

  // Fetch leads from backend
  const fetchLeads = async (page = 1, status = '', search = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await leadsAPI.getMyLeads(page, 10, status, search);
      
      if (response.data.leads) {
        setLeads(response.data.leads);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError(err.response?.data?.error || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const status = filterStatus === 'all' ? '' : filterStatus;
    fetchLeads(1, status, searchTerm);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const status = filterStatus === 'all' ? '' : filterStatus;
      fetchLeads(1, status, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    const statusParam = status === 'all' ? '' : status.toLowerCase();
    fetchLeads(1, statusParam, searchTerm);
  };

  const handleLeadTypeUpdate = async (leadId, newType) => {
    try {
      setUpdating(leadId);
      const response = await leadsAPI.updateLead(leadId, { type: newType });
      if (response.data.lead) {
        setLeads(leads.map(lead => lead._id === leadId ? response.data.lead : lead));
      }
      setShowTypeSelector(null);
    } catch (err) {
      alert('Failed to update lead type');
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
      {/* Curved Header */}
      <div className="leads-curved-header">
        <div className="header-top">
          <span className="brand-logo">Canova<span className="brand-crm">CRM</span></span>
        </div>
        <div className="header-title-row" onClick={() => navigate(-1)}>
          <span className="back-arrow">‹</span>
          <h1 className="header-title">Leads</h1>
        </div>
      </div>

      <div className="leads-main-content">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
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
                    <span className="calendar-icon">📅</span>
                    {formatDate(lead.date)}
                  </div>
                  
                  <div className="lead-actions-new">
                    {/* Action 1: Type Selector */}
                    <div className="action-button-container">
                      <button 
                        className="action-icon-btn" 
                        onClick={() => {
                          setShowTypeSelector(showTypeSelector === lead._id ? null : lead._id);
                          setShowScheduleSelector(null);
                          setShowStatusSelector(null);
                        }}
                      >
                        ✏️
                      </button>
                      {showTypeSelector === lead._id && (
                        <div className="type-dropdown-v2">
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
                        🕒
                      </button>
                      {showScheduleSelector === lead._id && (
                        <div className="schedule-popover-v2">
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
                        ⌄
                      </button>
                      
                      {showStatusSelector === lead._id && (
                        <div className="status-popover-v2">
                          <div className="status-label-row">
                            <label className="popup-label">Lead Status</label>
                            <span className="info-icon" title="Lead cannot be closed if scheduled">ⓘ</span>
                            {lead.type === 'Scheduled' && (
                              <div className="status-tooltip">Lead can not be closed if scheduled</div>
                            )}
                          </div>
                          
                          <select 
                            className="popup-select"
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                            disabled={lead.type === 'Scheduled'}
                          >
                            <option value="Ongoing">Ongoing</option>
                            <option value="Closed">Closed</option>
                          </select>
                          
                          <button className="popup-save-btn" onClick={() => handleStatusUpdate(lead._id)}>Save</button>
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
