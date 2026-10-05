import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Attach JWT token from localStorage when available.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ────────────────────────────────────────────────────
// Centralised error handling; further refined in later phases.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 handling (e.g. token expired) will be added in auth phase.
    return Promise.reject(error);
  },
);

export default api;
