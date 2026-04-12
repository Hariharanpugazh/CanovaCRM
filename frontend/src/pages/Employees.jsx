import React, { useState, useEffect } from 'react';
import './Employees.css';
import { employeeAPI } from '../utils/apiClient';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    languages: ''
  });
  const [showLangTooltip, setShowLangTooltip] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);

  // Fetch employees
  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll(page, 8, searchQuery);
      setEmployees(response.data.employees || []);
      setCurrentPage(page);
      setTotalPages(response.data.pagination?.pages || 1);
      setSelectedEmployees([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employees');
      console.error('Fetch employees error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for languages field
    if (name === 'languages') {
      // Split by comma but preserve the trailing comma if it exists
      const hasTrailingComma = value.endsWith(',');
      const parts = value.split(',');
      
      // Format each part (except the last empty one if there's a trailing comma)
      let formatted = parts
        .map(lang => {
          const trimmed = lang.trim();
          if (trimmed.length === 0) return '';
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        })
        .filter((lang, index) => {
          // Keep all non-empty parts and keep empty parts only if it's the last one and there's a trailing comma
          if (lang) return true;
          if (index === parts.length - 1 && hasTrailingComma) return true;
          return false;
        })
        .join(',');
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle add employee
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
        location: formData.location
      };

      await employeeAPI.create(payload);
      setShowAddModal(false);
      setFormData({
        name: '',
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        languages: ''
      });
      await fetchEmployees(1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee');
      console.error('Create employee error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit employee
  const handleEditEmployee = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: formData.name,
        status: formData.status,
        languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : []
      };

      await employeeAPI.update(editingEmployee._id, payload);
      setShowEditModal(false);
      setEditingEmployee(null);
      await fetchEmployees(currentPage);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee');
      console.error('Update employee error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete employee
  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setError(null);
        await employeeAPI.delete(id);
        await fetchEmployees(currentPage);
        setMenuOpen(null);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete employee');
        console.error('Delete error:', err);
      }
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedEmployees.length === 0) {
      setError('No employees selected');
      return;
    }

    if (window.confirm(`Delete ${selectedEmployees.length} employee(s)?`)) {
      try {
        setError(null);
        await employeeAPI.bulkDelete(selectedEmployees);
        await fetchEmployees(currentPage);
        setSelectedEmployees([]);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete employees');
        console.error('Bulk delete error:', err);
      }
    }
  };

  // Toggle checkbox
  const toggleCheckbox = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle all checkboxes
  const toggleAllCheckboxes = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp._id));
    }
  };

  // Open edit modal
  const openEditModal = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      firstName: employee.name.split(' ')[0],
      lastName: employee.name.split(' ').slice(1).join(' '),
      email: employee.email,
      location: employee.location || '',
      languages: employee.languages?.join(', ') || '',
      status: employee.status
    });
    setShowEditModal(true);
    setMenuOpen(null);
  };

  // Get avatar initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="employees">
      {/* Top Bar with Search */}
      <div className="employees-top-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      <div className="employees-content">
        {/* Header Section */}
        <div className="employees-header">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-item active">Employees</span>
          </div>

          {/* Action Buttons */}
          <div className="employees-actions">
            <button
              className="btn btn-secondary"
              onClick={() => setShowAddModal(true)}
            >
              Add Employees
            </button>
            {selectedEmployees.length > 0 && (
              <button
                className="btn btn-danger"
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedEmployees.length})
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="error-banner">{error}</div>}

        {/* Employees Table */}
        <div className="employees-table-container">
          {loading && !employees.length ? (
            <div className="loading">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="empty-state">
              <p>No employees found. Create your first employee by clicking "Add Employees"</p>
            </div>
          ) : (
            <table className="employees-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === employees.length && employees.length > 0}
                      onChange={toggleAllCheckboxes}
                      className="table-checkbox"
                    />
                  </th>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Assigned Leads</th>
                  <th>Closed Leads</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee._id)}
                        onChange={() => toggleCheckbox(employee._id)}
                        className="table-checkbox"
                      />
                    </td>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">
                          {employee.profileImage ? (
                            <img src={employee.profileImage} alt={employee.name} className="avatar-img" />
                          ) : (
                            getInitials(employee.name)
                          )}
                        </div>
                        <div className="employee-info">
                          <div className="employee-name">{employee.name}</div>
                          <div className="employee-email">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="employee-id-badge">{employee.employeeId}</span>
                    </td>
                    <td>{employee.assignedLeads || 0}</td>
                    <td>{employee.closedLeads || 0}</td>
                    <td>
                      <span className={`status-badge status-${(employee.status || 'Active').toLowerCase()}`}>
                        {employee.status || 'Active'}
                      </span>
                    </td>
                    <td className="action-cell">
                      <div className="menu-container">
                        <button
                          className="menu-btn"
                          onClick={() => setMenuOpen(menuOpen === employee._id ? null : employee._id)}
                        >
                          ⋮
                        </button>
                        {menuOpen === employee._id && (
                          <div className="menu-dropdown">
                            <button
                              className="menu-item"
                              onClick={() => openEditModal(employee)}
                            >
                              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              className="menu-item delete"
                              onClick={() => handleDeleteEmployee(employee._id)}
                            >
                              <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && employees.length > 0 && (
          <div className="pagination">
            <div className="pagination-left">
              <button
                className="pagination-btn"
                onClick={() => fetchEmployees(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                <span>Previous</span>
              </button>
            </div>

            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => fetchEmployees(page)}
                >
                  {page}
                </button>
              ))}
            </div>

            <div className="pagination-right">
              <button
                className="pagination-btn"
                onClick={() => fetchEmployees(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="Sarthak"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    placeholder="Pal"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Sarthakpal08@gmail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleFormChange}
                    placeholder="Karnataka"
                  />
                </div>

                <div className="form-group">
                  <label>Preferred Language</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleFormChange}
                      placeholder="Tamil,English"
                      className="lang-input"
                    />
                    <span 
                      className="info-icon"
                      onMouseEnter={() => setShowLangTooltip(true)}
                      onMouseLeave={() => setShowLangTooltip(false)}
                      style={{ position: 'absolute', right: '-25px' }}
                    >
                      ⓘ
                    </span>
                    {showLangTooltip && (
                      <div className="lang-tooltip">
                        Note: Enter languages separated by commas with first letter capitalized and no spaces (e.g.: Tamil,English,Hindi).
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn-save"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditEmployee}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status || 'Active'}
                    onChange={handleFormChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Language</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleFormChange}
                      placeholder="Tamil,English,Hindi"
                    />
                    <span 
                      className="info-icon"
                      onMouseEnter={() => setShowLangTooltip(true)}
                      onMouseLeave={() => setShowLangTooltip(false)}
                      style={{ position: 'absolute', right: '-25px' }}
                    >
                      ⓘ
                    </span>
                    {showLangTooltip && (
                      <div className="lang-tooltip">
                        Note: Enter languages separated by commas with first letter capitalized and no spaces (e.g.: Tamil,English,Hindi).
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn-save"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
