/**
 * Mock Authentication Adapter for Local Development & Testing.
 *
 * NOTE: This is a clearly separated fallback adapter used strictly when the backend
 * server (http://localhost:5000/api) is unavailable/offline during UI development.
 * It strictly adheres to the shared API contract and never grants admin access
 * via the public registration form.
 */

const MOCK_STORAGE_ACCOUNTS_KEY = 'mock_auth_registered_accounts';

// Pre-seeded demo accounts matching college project personas
const DEFAULT_MOCK_ACCOUNTS = [
  {
    id: 'usr_demo_attendee_1',
    name: 'Kunal Sharma',
    email: 'attendee@college.edu',
    password: 'password123',
    role: 'attendee',
    department: 'Computer Science',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_organizer_1',
    name: 'Dr. Neha Verma',
    email: 'organizer@college.edu',
    password: 'password123',
    role: 'organizer',
    department: 'Events Committee',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr_demo_admin_1',
    name: 'Admin Coordinator',
    email: 'admin@college.edu',
    password: 'password123',
    role: 'admin',
    department: 'Administration',
    createdAt: new Date().toISOString(),
  },
];

function getAccounts() {
  try {
    const stored = localStorage.getItem(MOCK_STORAGE_ACCOUNTS_KEY);
    if (!stored) {
      localStorage.setItem(MOCK_STORAGE_ACCOUNTS_KEY, JSON.stringify(DEFAULT_MOCK_ACCOUNTS));
      return DEFAULT_MOCK_ACCOUNTS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MOCK_ACCOUNTS;
  }
}

function saveAccounts(accounts) {
  try {
    localStorage.setItem(MOCK_STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save mock accounts', err);
  }
}

// Simulates network latency
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuthAdapter = {
  isMockAdapter: true,

  async login({ email, password }) {
    await delay(350);
    const accounts = getAccounts();
    const normalizedEmail = (email || '').trim().toLowerCase();
    const account = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!account || account.password !== password) {
      const error = new Error('Invalid email or password');
      error.response = {
        status: 401,
        data: {
          success: false,
          message: 'Invalid email or password',
        },
      };
      throw error;
    }

    const { password: _, ...publicUser } = account;
    const token = `mock-jwt-${publicUser.role}-${publicUser.id}-${Date.now()}`;

    return {
      success: true,
      data: {
        user: { ...publicUser, _isMockUser: true },
        token,
      },
      message: 'Logged in successfully (Mock Adapter Active: Backend Offline)',
    };
  },

  async register({ name, email, password, role }) {
    await delay(400);
    const accounts = getAccounts();
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Check if email already registered (matching backend 409)
    if (accounts.some((a) => a.email.toLowerCase() === normalizedEmail)) {
      const error = new Error('Email already registered');
      error.response = {
        status: 409,
        data: {
          success: false,
          message: 'Email already registered',
        },
      };
      throw error;
    }

    // Security requirement: Never allow admin registration from public form
    const assignedRole = role === 'organizer' ? 'organizer' : 'attendee';

    const newAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: assignedRole,
      createdAt: new Date().toISOString(),
    };

    accounts.push(newAccount);
    saveAccounts(accounts);

    const { password: _, ...publicUser } = newAccount;
    const token = `mock-jwt-${publicUser.role}-${publicUser.id}-${Date.now()}`;

    return {
      success: true,
      data: {
        user: { ...publicUser, _isMockUser: true },
        token,
      },
      message: 'Account registered successfully (Mock Adapter Active: Backend Offline)',
    };
  },

  async getMe(token) {
    await delay(200);
    if (!token) {
      const error = new Error('No authentication token provided');
      error.response = {
        status: 401,
        data: { success: false, message: 'No authentication token provided' },
      };
      throw error;
    }

    const accounts = getAccounts();
    // Parse role/id from mock token if possible, or fallback to first account matching role
    let found = null;
    for (const a of accounts) {
      if (token.includes(a.id) || token.includes(a.role)) {
        found = a;
        break;
      }
    }
    if (!found) {
      found = accounts[0];
    }

    const { password: _, ...publicUser } = found;
    return {
      success: true,
      data: { ...publicUser, _isMockUser: true },
    };
  },
};
