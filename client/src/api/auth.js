import apiClient from './client';
import { mockAuthAdapter } from './mockAuthAdapter';

/**
 * Authentication API Service
 * Handles communication with the backend authentication endpoints:
 *   POST /api/auth/register -> apiClient.post('/auth/register')
 *   POST /api/auth/login    -> apiClient.post('/auth/login')
 *   GET  /api/auth/me       -> apiClient.get('/auth/me')
 *
 * If the backend server is offline or unreachable, it uses mockAuthAdapter
 * and notifies the developer in the console.
 */

// Helper to determine if an error was due to backend being offline/unreachable
function isNetworkOfflineError(error) {
  return (
    !error.response &&
    (error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNREFUSED' ||
      error.message === 'Network Error' ||
      error.code === 'ENOTFOUND')
  );
}

/**
 * Authenticate existing user with email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ user: Object, token: string }>}
 */
export async function loginUser({ email, password }) {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const payload = response.data;

    if (payload.success && payload.data) {
      return {
        user: payload.data.user || payload.data,
        token: payload.data.token,
        isMock: false,
      };
    }
    throw new Error(payload.message || 'Login failed');
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        '[Auth API] Backend server at http://localhost:5000/api is offline or unreachable. Falling back to mock adapter.'
      );
      const mockResult = await mockAuthAdapter.login({ email, password });
      return {
        user: mockResult.data.user,
        token: mockResult.data.token,
        isMock: true,
      };
    }

    // Extract error message from server response if available
    const serverMessage =
      error.response?.data?.message || error.message || 'Login failed';
    const enhancedError = new Error(serverMessage);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Register a new attendee or organizer account
 * @param {Object} params - { name, email, password, role }
 * @returns {Promise<{ user: Object, token: string }>}
 */
export async function registerUser({ name, email, password, role }) {
  // Validate role safety on client side - prevent unauthorized admin registration
  const safeRole = role === 'organizer' ? 'organizer' : 'attendee';

  try {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      role: safeRole,
    });
    const payload = response.data;

    if (payload.success && payload.data) {
      return {
        user: payload.data.user || payload.data,
        token: payload.data.token,
        isMock: false,
      };
    }
    throw new Error(payload.message || 'Registration failed');
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        '[Auth API] Backend server at http://localhost:5000/api is offline or unreachable. Falling back to mock adapter.'
      );
      const mockResult = await mockAuthAdapter.register({
        name,
        email,
        password,
        role: safeRole,
      });
      return {
        user: mockResult.data.user,
        token: mockResult.data.token,
        isMock: true,
      };
    }

    const serverMessage =
      error.response?.data?.message || error.message || 'Registration failed';
    const enhancedError = new Error(serverMessage);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch profile of currently authenticated user using stored token
 * @param {string} token - Current JWT token
 * @returns {Promise<Object>} user object
 */
export async function getMe(token) {
  try {
    const response = await apiClient.get('/auth/me');
    const payload = response.data;

    if (payload.success && payload.data) {
      return payload.data.user || payload.data;
    }
    throw new Error(payload.message || 'Failed to verify session');
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        '[Auth API] Backend server offline. Verifying session via mock adapter.'
      );
      const mockResult = await mockAuthAdapter.getMe(token);
      return mockResult.data;
    }

    const serverMessage =
      error.response?.data?.message || error.message || 'Failed to verify session';
    const enhancedError = new Error(serverMessage);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}
