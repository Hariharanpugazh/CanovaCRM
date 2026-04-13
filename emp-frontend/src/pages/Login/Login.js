import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import './Login.css';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.token && response.data.user) {
        // Store token
        localStorage.setItem('token', response.data.token);
        
        // Store user data
        const user = response.data.user;
        localStorage.setItem('userId', user._id);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userStatus', user.status);
        
        // Update auth state
        setIsAuthenticated(true);
        
        // Navigate to home page
        navigate('/home');
      }
    } catch (err) {
      // Handle different error responses from backend
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1 className="login-logo-text">
            Canova<span className="logo-accent">CRM</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group-login">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input-login"
              required
            />
          </div>

          <div className="form-group-login">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              name="password"
              className="form-input-login"
            />
          </div>

          {error && <div className="error-message-login">{error}</div>}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </form>

        <div className="credentials-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>Credentials shared in document</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
