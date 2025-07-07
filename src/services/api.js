
// Use environment variable from Vercel, fallback to hardcoded URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment Variable:', process.env.REACT_APP_API_URL);

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized (token expired)
    if (response.status === 401) {
      console.log('Token expired, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
      return;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      console.log('Attempting login to:', `${API_BASE_URL}/api/auth/login`);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log('Attempting registration to:', `${API_BASE_URL}/api/auth/register`);
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getProfile: () => apiCall('/api/auth/profile'),

  updateTradingConfig: (config) => apiCall('/api/auth/trading-config', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),

  testSubscription: (action) => apiCall('/api/auth/test-subscription', {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall('/api/dashboard/stats'),
  
  updateTradingSettings: (settings) => apiCall('/api/dashboard/trading/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  getTrades: (page = 1, limit = 10) => 
    apiCall(`/api/dashboard/trades?page=${page}&limit=${limit}`),
  
  getAnalytics: (period = '7d') => 
    apiCall(`/api/dashboard/analytics?period=${period}`),
  
  depositToYieldWallet: (amount) => apiCall('/api/dashboard/yield-wallet/deposit', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  }),
};

// Trading API calls
export const tradingAPI = {
  getStatus: () => apiCall('/api/trading/status'),
  
  toggleTrading: (isActive) => apiCall('/api/trading/toggle', {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  }),
};

// Payment API calls
export const paymentAPI = {
  // Crypto payments
  verifyCryptoPayment: (paymentData) => apiCall('/api/payments/verify-crypto', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

// User settings API
export const userAPI = {
  updateTradingConfig: (config) => apiCall('/api/auth/trading-config', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),
};

// Export default object with all APIs
export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  trading: tradingAPI,
  payments: paymentAPI,
  user: userAPI,
};

// Export the base URL for other components that might need it
export { API_BASE_URL };