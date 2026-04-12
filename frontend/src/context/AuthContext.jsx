import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/apiClient';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const savedToken = storage.getToken();
    const savedUser = storage.getUser();
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;
      
      storage.setToken(token);
      storage.setUser(user);
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    storage.clearAll();
    setToken(null);
    setUser(null);
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await authAPI.register(name, email, password);
      const { token, user } = response.data;
      
      storage.setToken(token);
      storage.setUser(user);
      setToken(token);
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
