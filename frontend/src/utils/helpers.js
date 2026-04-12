// Local storage utilities
export const storage = {
  setToken: (token) => localStorage.setItem('authToken', token),
  getToken: () => localStorage.getItem('authToken'),
  removeToken: () => localStorage.removeItem('authToken'),
  
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('user'),
  
  clearAll: () => localStorage.clear()
};

// Date utilities
export const dateUtils = {
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },
  
  formatDateTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-US');
  },
  
  formatTime: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US');
  },
  
  getDaysAgo: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / (1000 * 60 * 60 * 24));
    return diff;
  }
};

// Validation utilities
export const validators = {
  isEmail: (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  },
  
  isStrongPassword: (password) => {
    return password && password.length >= 6;
  },
  
  isNotEmpty: (value) => {
    return value && value.trim().length > 0;
  }
};

// Number utilities
export const numberUtils = {
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },
  
  formatNumber: (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  },
  
  percentage: (part, whole) => {
    if (whole === 0) return 0;
    return ((part / whole) * 100).toFixed(2);
  }
};

// Array utilities
export const arrayUtils = {
  unique: (array) => [...new Set(array)],
  
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const group = item[key];
      if (!result[group]) result[group] = [];
      result[group].push(item);
      return result;
    }, {});
  },
  
  sortBy: (array, key, order = 'asc') => {
    return [...array].sort((a, b) => {
      if (order === 'asc') return a[key] > b[key] ? 1 : -1;
      return a[key] < b[key] ? 1 : -1;
    });
  }
};

// Notification utilities
export const notify = {
  success: (message) => console.log('✅ Success:', message),
  error: (message) => console.error('❌ Error:', message),
  warning: (message) => console.warn('⚠️ Warning:', message),
  info: (message) => console.log('ℹ️ Info:', message)
};
