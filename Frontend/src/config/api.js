export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Log the backend URL for debugging
console.log('=== API Configuration ===');
console.log('Backend URL:', BACKEND_URL);
console.log('Environment:', import.meta.env.MODE);
console.log('=======================');

export const API_ENDPOINTS = {
  login: `${BACKEND_URL}/api/auth/login`,
  signup: `${BACKEND_URL}/api/auth/signup`,
  logout: `${BACKEND_URL}/api/auth/logout`,
  checkAuth: `${BACKEND_URL}/api/auth/check`,
  updateProfile: `${BACKEND_URL}/api/auth/update-profile`,
  getUsers: `${BACKEND_URL}/api/messages/users`,
  getMessages: (id) => `${BACKEND_URL}/api/messages/${id}`,
  sendMessage: (id) => `${BACKEND_URL}/api/messages/send/${id}`,
  status: `${BACKEND_URL}/api/status`,
};

export const API_CONFIG = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
}; 