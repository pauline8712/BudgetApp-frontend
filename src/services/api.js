import axios from 'axios';

const api = axios.create({
  baseURL: 'https://group-project-backend-production.up.railway.app/api',
});

// Interceptor — lägger automatiskt till JWT-token på alla requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;