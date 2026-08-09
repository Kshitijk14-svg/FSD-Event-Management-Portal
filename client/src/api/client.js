import axios from 'axios';

/**
 * Reusable Axios client for the EventHub backend.
 *
 * - baseURL is read from VITE_API_URL (see .env.example).
 * - A request interceptor attaches the stored JWT as `Authorization: Bearer <token>`.
 * - A response interceptor clears the token and redirects to /login on a 401.
 *
 * Phase 0 note: no real endpoints are called yet. This client is wired
 * and ready for Phase 1+; it is NOT used to hit any backend during Phase 0.
 */

export const TOKEN_KEY = 'eventhub_token';

// Persist/read helpers kept co-located so every consumer uses the same key.
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

const client = axios.create({
  // Fallback to a local dev path if the env var is missing.
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach the bearer token when present.
client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 by clearing the invalid token and
// redirecting to /login. Uses window.location so it works from anywhere.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearToken();
      // Avoid redirecting if the user is already on the login page.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
