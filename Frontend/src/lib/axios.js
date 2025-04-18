import axios from 'axios';
import { BACKEND_URL } from '../config/api';
import toast from 'react-hot-toast';

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

const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to log all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    // ALWAYS add Authorization header with memory token if available
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    
    // Add additional testing token in custom header
    config.headers['x-auth-token'] = memoryToken;
    
    // Force credentials for every request
    config.withCredentials = true;
    
    console.log('Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      withCredentials: config.withCredentials,
      headers: {
        'Content-Type': config.headers['Content-Type'],
        'Authorization': config.headers.Authorization ? 'Bearer [token]' : 'none',
        'x-auth-token': config.headers['x-auth-token'] ? '[token]' : 'none'
      }
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
      data: response.data ? 'Data received' : 'No data'
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
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers ? {
        'Content-Type': error.config.headers['Content-Type'],
        'Authorization': error.config.headers.Authorization ? 'Bearer [token]' : 'none',
        'x-auth-token': error.config.headers['x-auth-token'] ? '[token]' : 'none'
      } : 'No headers',
      baseURL: error.config?.baseURL
    });
    
    // If we get a network error, show a specific message
    if (error.message === 'Network Error') {
      toast.error('Network error: Unable to connect to the server. Please check your internet connection or try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 