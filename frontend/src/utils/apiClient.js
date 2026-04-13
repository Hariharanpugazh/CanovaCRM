import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Login is disabled in the frontend.
      // Clear any stale auth and keep the user on the dashboard.
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      if (window.location.pathname !== '/dashboard') {
        window.location.replace('/dashboard');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Login is disabled in the frontend.
  // login: (email, password) => apiClient.post('/auth/login', { email, password }),
  // register: (name, email, password) => apiClient.post('/auth/register', { name, email, password }),
  // getCurrentUser: () => apiClient.get('/auth/me')
};

// Employees API calls
export const employeeAPI = {
  getAll: (page = 1, limit = 8, search = '') => 
    apiClient.get('/employees', { params: { page, limit, search } }),
  create: (data) => apiClient.post('/employees', data),
  update: (id, data) => apiClient.put(`/employees/${id}`, data),
  delete: (id) => apiClient.delete(`/employees/${id}`),
  bulkDelete: (ids) => apiClient.post('/employees/bulk-delete', { ids })
};

// Leads API calls
export const leadsAPI = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/leads/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  create: (data) => apiClient.post('/leads', data),
  getAll: (page = 1, limit = 10, filters = {}) => 
    apiClient.get('/leads/all', { params: { page, limit, ...filters } }),
  getMyLeads: (page = 1, limit = 10, status = '') => 
    apiClient.get('/leads/my-leads', { params: { page, limit, status } }),
  updateStatus: (id, data) => apiClient.put(`/leads/${id}/status`, data)
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getSalesGraph: () => apiClient.get('/dashboard/graph'),
  getActivities: () => apiClient.get('/dashboard/activities'),
  getActiveSalesPeople: () => apiClient.get('/dashboard/sales-people'),
  searchTeamMember: (q) => apiClient.get('/dashboard/search-team', { params: { q } })
};

export default apiClient;
