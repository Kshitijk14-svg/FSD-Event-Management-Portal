import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './authContextDef';
import { loginUser, registerUser, getMe } from '../api/auth';
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  AUTH_UNAUTHORIZED_EVENT,
} from '../utils/constants';

/**
 * Production Authentication Provider for Phase F3.
 * Manages user authentication state, token persistence in localStorage,
 * and automatic session restoration on browser refresh.
 */
export function AuthProvider({ children }) {
  // Read persisted token and user on startup to prevent flash of logged-out state
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // If a token exists on startup, start in loading state while verifying with GET /auth/me
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));
  const [isMockSession, setIsMockSession] = useState(false);

  // Clear session helper
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setIsMockSession(false);
    setLoading(false);
  }, []);

  // On application startup, verify token with GET /auth/me if one exists
  useEffect(() => {
    let isMounted = true;
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      return;
    }

    async function restoreSession() {
      try {
        const verifiedUser = await getMe(storedToken);
        if (isMounted) {
          setUser(verifiedUser);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(verifiedUser));
          if (verifiedUser._isMockUser) {
            setIsMockSession(true);
          }
        }
      } catch (error) {
        console.warn('[AuthContext] Session invalid or expired. Clearing credentials:', error.message);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    // Listen for 401 unauthorized events dispatched by apiClient response interceptor
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [logout]);

  /**
   * Log in user with email and password
   */
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      const { user: loggedInUser, token: authToken, isMock } = result;

      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));

      setToken(authToken);
      setUser(loggedInUser);
      setIsMockSession(Boolean(isMock));

      return loggedInUser;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user account (Attendee or Organizer only)
   */
  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const result = await registerUser({ name, email, password, role });
      const { user: registeredUser, token: authToken, isMock } = result;

      localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(registeredUser));

      setToken(authToken);
      setUser(registeredUser);
      setIsMockSession(Boolean(isMock));

      return registeredUser;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token && user),
        role: user?.role || 'guest',
        isMockSession,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
