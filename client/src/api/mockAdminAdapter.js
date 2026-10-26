import { MOCK_EVENTS } from './mockEventsAdapter';

/**
 * Mock Admin Adapter for Local Development & Testing.
 *
 * Simulates backend administration endpoints:
 *   GET    /api/admin/stats
 *   GET    /api/admin/users
 *   PATCH  /api/admin/users/:id/role
 *   DELETE /api/admin/users/:id
 */

const STORAGE_USERS_KEY = 'mock_admin_users_store';

const DEFAULT_USERS = [
  {
    _id: 'usr_101',
    name: 'Kunal Sharma',
    email: 'attendee@college.edu',
    role: 'attendee',
    department: 'Computer Science',
    createdAt: '2026-10-15T09:00:00.000Z',
  },
  {
    _id: 'usr_102',
    name: 'Dr. Neha Verma',
    email: 'organizer@college.edu',
    role: 'organizer',
    department: 'Events Committee',
    createdAt: '2026-10-16T11:30:00.000Z',
  },
  {
    _id: 'usr_103',
    name: 'Admin Coordinator',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Administration',
    createdAt: '2026-10-10T08:00:00.000Z',
  },
  {
    _id: 'usr_104',
    name: 'Aarav Patel',
    email: 'aarav.p@college.edu',
    role: 'attendee',
    department: 'Mechanical Engineering',
    createdAt: '2026-10-18T14:15:00.000Z',
  },
  {
    _id: 'usr_105',
    name: 'Prof. Ramesh Gupta',
    email: 'ramesh.g@college.edu',
    role: 'organizer',
    department: 'Robotics Club',
    createdAt: '2026-10-20T10:45:00.000Z',
  },
  {
    _id: 'usr_106',
    name: 'Priya Iyer',
    email: 'priya.i@college.edu',
    role: 'attendee',
    department: 'Information Science',
    createdAt: '2026-10-22T13:20:00.000Z',
  },
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USERS;
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save mock admin users', err);
  }
}

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAdminAdapter = {
  isMockAdapter: true,

  async getStats() {
    await delay(200);
    const users = getStoredUsers();
    const events = MOCK_EVENTS;
    const totalRegistrations = events.reduce((sum, e) => {
      const registered = Math.max(0, (e.capacity || 50) - (e.seatsLeft !== undefined ? e.seatsLeft : 0));
      return sum + registered;
    }, 0);

    return {
      success: true,
      data: {
        totalUsers: users.length,
        totalEvents: events.length,
        totalRegistrations,
      },
      _isMock: true,
    };
  },

  async getUsers() {
    await delay(250);
    const users = getStoredUsers();
    return {
      success: true,
      data: users,
      _isMock: true,
    };
  },

  async updateUserRole(userId, newRole) {
    await delay(300);
    const users = getStoredUsers();
    const index = users.findIndex((u) => String(u._id) === String(userId));

    if (index === -1) {
      const err = new Error(`User #${userId} not found`);
      err.response = { status: 404, data: { success: false, message: 'User not found' } };
      throw err;
    }

    users[index] = {
      ...users[index],
      role: newRole,
      updatedAt: new Date().toISOString(),
    };
    saveStoredUsers(users);

    return {
      success: true,
      message: `User role updated to ${newRole}`,
      data: users[index],
      _isMock: true,
    };
  },

  async deleteUser(userId) {
    await delay(300);
    const users = getStoredUsers();
    const index = users.findIndex((u) => String(u._id) === String(userId));

    if (index === -1) {
      const err = new Error(`User #${userId} not found`);
      err.response = { status: 404, data: { success: false, message: 'User not found' } };
      throw err;
    }

    const deleted = users.splice(index, 1)[0];
    saveStoredUsers(users);

    return {
      success: true,
      message: `User ${deleted.name} has been deleted`,
      data: { id: userId },
      _isMock: true,
    };
  },
};
