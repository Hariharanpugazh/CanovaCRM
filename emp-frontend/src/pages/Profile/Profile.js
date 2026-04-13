import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Load user data from localStorage
    const userEmail = localStorage.getItem('userEmail');
    const savedProfile = localStorage.getItem('userProfile');

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      // Mock data if no saved profile
      setProfile({
        firstName: 'Rajesh',
        lastName: 'Mehta',
        email: userEmail || 'rajesh.mehta@example.com',
        password: '••••••••',
        confirmPassword: '••••••••',
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSave = async () => {
    // Validation
    if (!profile.firstName || !profile.lastName || !profile.email) {
      setError('All fields are required');
      return;
    }

    if (profile.password && profile.password !== profile.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // TODO: Update backend
      // Mock save for now
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header */}
        <div className="profile-header">
          <h1 className="profile-title">Profile</h1>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Success Message */}
        {success && <div className="success-message">{success}</div>}

        {/* Profile Form */}
        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>

          {isEditing && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={profile.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter new password (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={profile.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Confirm password"
                />
              </div>
            </>
          )}
        </form>

        {/* Action Buttons */}
        <div className="button-group">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button onClick={handleLogout} className="btn btn-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSave} className="btn btn-primary">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default Profile;
