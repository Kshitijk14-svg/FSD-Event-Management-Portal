import { createContext } from 'react';

/**
 * React Context instance for Authentication.
 * Kept in a dedicated definition file for Vite React Fast Refresh compliance.
 */
export const AuthContext = createContext(null);

export default AuthContext;
