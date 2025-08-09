import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://ecommercebackend-production-6915.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor (adds auth token to headers)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handles 401 errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Redirect to login');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
