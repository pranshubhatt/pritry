export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  login: `${BACKEND_URL}/api/auth/login`,
  signup: `${BACKEND_URL}/api/auth/signup`,
  logout: `${BACKEND_URL}/api/auth/logout`,
  checkAuth: `${BACKEND_URL}/api/auth/check`,
  updateProfile: `${BACKEND_URL}/api/auth/update-profile`,
  getUsers: `${BACKEND_URL}/api/messages/users`,
  getMessages: (id) => `${BACKEND_URL}/api/messages/${id}`,
  sendMessage: (id) => `${BACKEND_URL}/api/messages/send/${id}`,
};

export const API_CONFIG = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
}; 