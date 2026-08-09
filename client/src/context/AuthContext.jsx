import { createContext, useContext, useMemo, useState } from 'react';
import { getToken } from '../api/client.js';

/**
 * Phase 0 placeholder auth context.
 *
 * It only exposes whether a token exists locally. Real authentication
 * (login/register/session) is NOT implemented and lands in a later phase.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getToken());

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      // No-op placeholders for future phases.
      login: () => {},
      logout: () => setToken(null),
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
