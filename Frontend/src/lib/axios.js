import axios from 'axios';
import { BACKEND_URL } from '../config/api';

console.log('Backend URL:', BACKEND_URL);

// Store token in memory as a backup
let memoryToken = localStorage.getItem('backup_token') || null;

export const setMemoryToken = (token) => {
  console.log('Setting memory token:', token ? 'token-provided' : 'no-token');
  memoryToken = token;
  if (token) {
    localStorage.setItem('backup_token', token);
  } else {
    localStorage.removeItem('backup_token');
  }
};

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to log all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header with memory token if available
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    
    console.log('Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    // Extract token from response header if available
    const authHeader = response.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      setMemoryToken(authHeader.split(' ')[1]);
    }
    
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response',
      request: error.request ? 'Request made but no response received' : 'No request made'
    });
    return Promise.reject(error);
  }
); 