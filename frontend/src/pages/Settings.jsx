import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      const [firstName, lastName] = user.name.split(' ');
      setFormData((prev) => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setMessage({ type: 'error', text: 'First name, last name, and email are required' });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      setLoading(true);

      // TODO: Call API to update profile
      // const response = await authAPI.updateProfile(formData);
      
      // Simulated success
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings-content">
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <h2>Edit Profile</h2>
          </div>

          <form onSubmit={handleSubmit} className="settings-form">
            {/* First Name */}
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="form-input"
              />
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="form-input"
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="form-input"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password (optional)"
                className="form-input"
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="form-input"
              />
            </div>

            {/* Message */}
            {message.text && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn-save"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
