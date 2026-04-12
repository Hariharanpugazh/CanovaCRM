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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        languages: formData.languages ? [formData.languages] : [],
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
        languages: formData.languages ? [formData.languages] : []
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
      languages: employee.languages?.[0] || '',
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
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">Employees</span>
      </div>

      {/* Action Buttons */}
      <div className="employees-actions">
        <button
          className="btn btn-primary"
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
                      <div className="avatar">{getInitials(employee.name)}</div>
                      <div className="employee-info">
                        <div className="employee-name">{employee.name}</div>
                        <div className="employee-email">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{employee.employeeId}</td>
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
                            ✏️ Edit
                          </button>
                          <button
                            className="menu-item delete"
                            onClick={() => handleDeleteEmployee(employee._id)}
                          >
                            🗑️ Delete
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
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => fetchEmployees(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹ Previous
          </button>
          <div className="pagination-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => fetchEmployees(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && <span className="pagination-dots">...</span>}
          </div>
          <button
            className="pagination-btn"
            onClick={() => fetchEmployees(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddEmployee} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>First name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="First name"
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
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Email (will be default password)"
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
                  placeholder="e.g., Mumbai, Delhi"
                />
              </div>

              <div className="form-group">
                <label>Preferred Language</label>
                <select
                  name="languages"
                  value={formData.languages}
                  onChange={handleFormChange}
                >
                  <option value="">Select a language</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
            <form onSubmit={handleEditEmployee} className="modal-body">
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
                <select
                  name="languages"
                  value={formData.languages}
                  onChange={handleFormChange}
                >
                  <option value="">Select a language</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
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
