import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
};

export const employeeAPI = {
  getProfile: () => apiClient.get('/employees/profile'),
  updateProfile: (data) => apiClient.patch('/employees/profile', data),
  checkIn: () => apiClient.post('/employees/checkin'),
  checkOut: () => apiClient.post('/employees/checkout'),
};

export const leadsAPI = {
  // Get current user's assigned leads
  getMyLeads: (page = 1, limit = 8, status = '', search = '') => {
    let url = `/leads/my-leads?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (search) url += `&search=${search}`;
    return apiClient.get(url);
  },
  
  // Get only scheduled leads for current user
  getScheduledLeads: (page = 1, limit = 50, search = '') => {
    let url = `/leads/scheduled-calls?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    return apiClient.get(url);
  },
  
  // Update lead status, type, or schedule date
  updateLead: (leadId, data) => apiClient.put(`/leads/${leadId}/status`, data),
  
  // Get leads by status
  getLeadsByStatus: (status) => apiClient.get(`/leads/my-leads?status=${status}`),
};

export const scheduleAPI = {
  getSchedules: () => apiClient.get('/schedules'),
  createSchedule: (data) => apiClient.post('/schedules', data),
  updateSchedule: (scheduleId, data) => apiClient.patch(`/schedules/${scheduleId}`, data),
};

export const activityAPI = {
  getActivities: () => apiClient.get('/activities'),
};

export default apiClient;
