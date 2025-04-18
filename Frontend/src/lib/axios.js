import axios from 'axios';
import { BACKEND_URL } from '../config/api';

export const axiosInstance = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
); 