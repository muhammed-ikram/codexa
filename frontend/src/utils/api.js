import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://codexa-api.onrender.com/api",
  withCredentials: true,
  timeout: 30000, // 30 second timeout for production
});

// Add request interceptor to include token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data, error.config?.url);
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it and redirect to login
      console.log('401 Error - redirecting to login');
      localStorage.removeItem("token");
      // Use a more gentle redirect that doesn't cause full page reload
      if (window.location.pathname !== '/login') {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
