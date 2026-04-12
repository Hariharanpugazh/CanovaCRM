import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { leadsAPI } from '../utils/apiClient';
import '../styles/Leads.css';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvProgress, setCsvProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: '',
    date: '',
    location: '',
    language: 'English'
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingLead, setEditingLead] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);

  // Fetch leads
  const fetchLeads = async (page = 1) => {
    try {
      setLoading(true);
      const response = await leadsAPI.getAll(page, 10, {});
      setLeads(response.data.leads || []);
      setTotalPages(response.data.pagination?.pages || response.data.totalPages || 1);
      setCurrentPage(page);
      setError('');
    } catch (err) {
      setError('Failed to fetch leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, []);

  // Handle Add Lead form submit
  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const leadData = {
        ...formData,
        date: new Date(formData.date).toISOString()
      };
      const response = await leadsAPI.create(leadData);
      setSuccessMessage('Lead created successfully!');
      setFormData({
        name: '',
        email: '',
        source: '',
        date: '',
        location: '',
        language: 'English'
      });
      setShowAddModal(false);
      fetchLeads(1);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create lead');
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV Upload
  const handleCSVFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setCsvFile(null);
    }
  };

  const handleCSVUpload = async () => {
    if (!csvFile) {
      setError('Please select a CSV file');
      return;
    }

    try {
      setCsvUploading(true);
      setCsvProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setCsvProgress((prev) => {
          if (prev < 90) return prev + Math.random() * 30;
          return prev;
        });
      }, 300);

      const response = await leadsAPI.uploadCSV(csvFile);

      clearInterval(progressInterval);
      setCsvProgress(100);

      setSuccessMessage(`${response.data.leadsCount} leads imported successfully!`);
      setCsvFile(null);
      setCsvUploading(false);
      setShowCSVModal(false);
      setCsvProgress(0);
      fetchLeads(1);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload CSV');
      setCsvUploading(false);
      setCsvProgress(0);
    }
  };

  // Handle Lead Status Update
  const handleUpdateStatus = async (leadId, updatedData) => {
    try {
      await leadsAPI.updateStatus(leadId, updatedData);
      setSuccessMessage('Lead updated successfully!');
      setStatusModalData(null);
      fetchLeads(currentPage);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update lead');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="leads-page">
      {/* Search Bar at Top Container */}
      <div className="leads-search-container">
        <div className="leads-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="leads-content">
        {/* Messages */}
        {error && <div className="error-banner">{error}</div>}
        {successMessage && <div className="success-banner">{successMessage}</div>}

        {/* Breadcrumb and Actions Header */}
        <div className="leads-header">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Leads</span>
          </div>
          <div className="leads-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(true)}
            >
              Add Manually
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowCSVModal(true)}
            >
              Add CSV
            </button>
          </div>
        </div>

        {/* Leads Table Wrapper */}
        <div className="leads-table-wrapper">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="no-data">No leads found</div>
          ) : (
            <table className="leads-table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Language</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Scheduled Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={lead._id} onClick={() => setStatusModalData(lead)}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>
                    <td>{formatDate(lead.date)}</td>
                    <td>{lead.location}</td>
                    <td>{lead.language}</td>
                    <td className="assigned-to-id">{lead.assignedTo?._id || 'N/A'}</td>
                    <td>{lead.status}</td>
                    <td>{lead.type}</td>
                    <td>{formatDate(lead.scheduledDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination outside the white wrapper */}
        {!loading && leads.length > 0 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => fetchLeads(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span>Previous</span>
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => fetchLeads(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pagination-btn"
              onClick={() => fetchLeads(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* Manual Add Lead Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Lead</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddLead} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) =>
                      setFormData({ ...formData, source: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    required
                  >
                    <option value="English">English</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <div className="modal-overlay" onClick={() => setShowCSVModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>CSV Upload</h2>
              <button
                className="modal-close"
                onClick={() => setShowCSVModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p className="csv-description">Add your documents here</p>

              {!csvUploading ? (
                <div className="csv-upload-area">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>Drag your files here</p>
                  <label className="csv-upload-btn">
                    Browse Files
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p className="csv-hint">Sample File.csv</p>
                </div>
              ) : (
                <div className="csv-uploading">
                  <div className="spinner"></div>
                  <p>Verifying...</p>
                </div>
              )}

              {csvFile && !csvUploading && (
                <div className="csv-file-selected">
                  <p>✓ {csvFile.name} selected</p>
                </div>
              )}

              <div className="csv-format-info">
                <h4>CSV Format (Required Columns):</h4>
                <ul>
                  <li>Name</li>
                  <li>Email</li>
                  <li>Source</li>
                  <li>Date</li>
                  <li>Location</li>
                  <li>Language</li>
                </ul>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowCSVModal(false);
                    setCsvFile(null);
                  }}
                  disabled={csvUploading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCSVUpload}
                  disabled={csvUploading || !csvFile}
                >
                  {csvUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusModalData && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModalData(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Lead - {statusModalData.name}</h2>
              <button
                className="modal-close"
                onClick={() => setStatusModalData(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Status</label>
                <select
                  defaultValue={statusModalData.status}
                  onChange={(e) => {
                    handleUpdateStatus(statusModalData._id, {
                      status: e.target.value
                    });
                  }}
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Closed">Closed</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select
                  defaultValue={statusModalData.type}
                  onChange={(e) => {
                    handleUpdateStatus(statusModalData._id, {
                      type: e.target.value
                    });
                  }}
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              {statusModalData.type === 'Scheduled' && (
                <div className="form-group">
                  <label>Scheduled Date</label>
                  <input
                    type="date"
                    defaultValue={
                      statusModalData.scheduledDate
                        ? new Date(statusModalData.scheduledDate)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) => {
                      handleUpdateStatus(statusModalData._id, {
                        type: 'Scheduled',
                        scheduledDate: e.target.value
                      });
                    }}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => setStatusModalData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
