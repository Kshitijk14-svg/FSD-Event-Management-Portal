import apiClient from './client';
import { mockAdminAdapter } from './mockAdminAdapter';
import { mockOrganizerAdapter } from './mockOrganizerAdapter';
import { mockEventsAdapter } from './mockEventsAdapter';

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
 * Fetch platform statistics
 * GET /api/admin/stats
 */
export async function fetchAdminStats() {
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn('[Admin API] Backend offline. Using mock admin stats adapter.');
      return await mockAdminAdapter.getStats();
    }
    const message = error.response?.data?.message || error.message || 'Failed to load platform stats';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch list of registered platform users
 * GET /api/admin/users
 */
export async function fetchAdminUsers() {
  try {
    const response = await apiClient.get('/admin/users');
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn('[Admin API] Backend offline. Using mock admin users adapter.');
      return await mockAdminAdapter.getUsers();
    }
    const message = error.response?.data?.message || error.message || 'Failed to load users list';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Update user role
 * PATCH /api/admin/users/:id/role
 */
export async function updateUserRole(userId, role) {
  try {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Admin API] Backend offline. Updating role for user #${userId} via mock adapter.`);
      return await mockAdminAdapter.updateUserRole(userId, role);
    }
    const message = error.response?.data?.message || error.message || 'Failed to update user role';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Delete a user
 * DELETE /api/admin/users/:id
 */
export async function deleteUser(userId) {
  try {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Admin API] Backend offline. Deleting user #${userId} via mock adapter.`);
      return await mockAdminAdapter.deleteUser(userId);
    }
    const message = error.response?.data?.message || error.message || 'Failed to delete user';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Admin delete any event
 * DELETE /api/events/:id
 */
export async function adminDeleteEvent(eventId, currentUser) {
  try {
    const response = await apiClient.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Admin API] Backend offline. Deleting event #${eventId} via mock adapter.`);
      return await mockOrganizerAdapter.deleteEvent(eventId, currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to delete event';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch all platform events for admin moderation
 * GET /api/events
 */
export async function fetchAdminEvents() {
  try {
    const response = await apiClient.get('/events', { params: { limit: 100 } });
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn('[Admin API] Backend offline. Fetching events via mock adapter.');
      return await mockEventsAdapter.getEvents({ limit: 100 });
    }
    const message = error.response?.data?.message || error.message || 'Failed to load platform events';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}
