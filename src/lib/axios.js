import axios from 'axios';

// Auto-detect backend URL
const getBaseURL = () => {
  // Try prod first, fallback to local
  const prodUrl = 'http://145.223.118.9:5000';
  const localUrl = 'http://localhost:5000';
  
  // Use environment variable if set, otherwise default to prod
  return process.env.NEXT_PUBLIC_API_URL || prodUrl;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor (adds auth token to headers)
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  // Remove Content-Type for FormData to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});

// Response interceptor (handles errors and backend switching)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      console.error('Unauthorized - Redirect to login');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle network errors - try switching backend
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      const currentBaseURL = axiosInstance.defaults.baseURL;
      const prodUrl = 'http://145.223.118.9:5000';
      const localUrl = 'http://localhost:5000';
      
      // Switch to alternative backend
      const alternativeUrl = currentBaseURL === prodUrl ? localUrl : prodUrl;
      
      console.log(`Switching from ${currentBaseURL} to ${alternativeUrl}`);
      axiosInstance.defaults.baseURL = alternativeUrl;
      
      // Retry the request with new base URL
      return axiosInstance.request(error.config);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
