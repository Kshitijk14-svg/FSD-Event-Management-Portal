import axios from 'axios';

/**
 * Reusable Axios instance for MERN Event Management Portal.
 * Reads baseURL dynamically from Vite environment variable without hardcoding.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor:
 * Reads JWT token from localStorage and attaches it to authenticated requests.
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Handles HTTP 401 Unauthorized responses safely.
 * - Avoids logging out for unrelated public requests.
 * - Avoids infinite redirects by delegating session handling via CustomEvent.
 * - Ignores 401 on login/register endpoints (which indicate invalid credentials).
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error || {};

    if (response && response.status === 401) {
      const hasAuthHeader = Boolean(
        config?.headers?.Authorization || config?.headers?.authorization
      );
      const hasStoredToken = Boolean(localStorage.getItem('token'));
      const isAuthEndpoint =
        config?.url?.includes('/auth/login') ||
        config?.url?.includes('/auth/register');

      // Clear invalid authentication data and notify context only if this was
      // an authenticated request with an expired/invalid token
      if ((hasAuthHeader || hasStoredToken) && !isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Notify authentication context safely without forcing page reloads or loops
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('auth:unauthorized', {
              detail: {
                message: 'Your session has expired. Please log in again.',
                endpoint: config?.url,
              },
            })
          );
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
