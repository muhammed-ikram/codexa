import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://codexa-api.onrender.com/api",
  withCredentials: true,
  timeout: 30000, // 30 second timeout for production
});

export default api;
