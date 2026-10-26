/**
 * Application Constants
 */
export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';
export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';
export const DEV_MOCK_ROLE_KEY = 'dev_mock_role';

// Mock user profiles by role for development phase testing
export const MOCK_USERS = {
  attendee: {
    name: 'Kunal Sharma',
    email: 'kunal.sharma@college.edu',
    role: 'attendee',
    department: 'Computer Science',
  },
  organizer: {
    name: 'Dr. Neha Verma',
    email: 'n.verma@college.edu',
    role: 'organizer',
    department: 'Events Committee',
  },
  admin: {
    name: 'Admin Coordinator',
    email: 'admin@eventportal.edu',
    role: 'admin',
    department: 'Administration',
  },
};
