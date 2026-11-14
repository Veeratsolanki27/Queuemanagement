import axios from 'axios';

// When running locally on Vite (localhost:5173), target local Spring Boot (http://localhost:8080/api/v1)
// When running in production (e.g. on Netlify), use the relative path '/api/v1' so Netlify proxies directly
// or use the explicit VITE_API_URL if provided.
const getBaseUrl = (): string => {
  let url = import.meta.env.VITE_API_URL;
  if (url) {
    url = url.trim().replace(/\/+$/, '');
    if (!url.endsWith('/api/v1')) {
      url = `${url}/api/v1`;
    }
    return url;
  }
  // Check if browser is on localhost
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8080/api/v1';
  }
  // In production (Netlify), fallback to relative '/api/v1'
  return '/api/v1';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
