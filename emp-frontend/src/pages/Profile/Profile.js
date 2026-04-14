import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import HeaderBanner from '../../components/HeaderBanner/HeaderBanner';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import { authAPI } from '../../utils/api';

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
  const [loading, setLoading] = useState(true);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getCurrentUser();
        const user = response.data.user;

        // Split name into firstName and lastName
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setProfile({
          firstName,
          lastName,
          email: user.email,
          password: '',
          confirmPassword: '',
        });
        setError('');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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

    if (profile.password !== profile.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Combine firstName and lastName into name for backend
      const updateData = {
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
      };

      // Only include password if provided
      if (profile.password && profile.password.length > 0) {
        updateData.password = profile.password;
      }

      const response = await authAPI.updateProfile(updateData);
      
      setSuccess(response.data.message || 'Profile updated successfully');
      setIsEditing(false);
      
      // Clear password fields after successful save
      setProfile((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }));

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleLogout = () => {
    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userStatus');
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <HeaderBanner title="Profile" showBack={true} />
        <div className="profile-content">
          <div className="loading">Loading profile...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Header Banner */}
      <HeaderBanner title="Profile" showBack={true} />
      
      <div className="profile-content">
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
              disabled={true}
              className="form-input"
            />
          </div>

          {isEditing && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <PasswordInput
                  value={profile.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (optional)"
                  name="password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <PasswordInput
                  value={profile.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  name="confirmPassword"
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
