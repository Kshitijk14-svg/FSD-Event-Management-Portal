import apiClient from './client';
import { mockRegistrationsAdapter } from './mockRegistrationsAdapter';

/**
 * Event Registration API Service
 * Handles communication with the backend registration endpoints:
 *   POST   /api/events/:id/register -> apiClient.post(`/events/${id}/register`)
 *   DELETE /api/events/:id/register -> apiClient.delete(`/events/${id}/register`)
 *   GET    /api/registrations/mine  -> apiClient.get('/registrations/mine')
 *
 * Automatically delegates to mockRegistrationsAdapter when backend is offline.
 */

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
 * Register current user for an event
 * @param {string} eventId
 * @param {Object} currentUser
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function registerForEvent(eventId, currentUser) {
  try {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        `[Registrations API] Backend offline. Processing registration for event #${eventId} via mock adapter.`
      );
      return await mockRegistrationsAdapter.register(eventId, currentUser);
    }

    const message =
      error.response?.data?.message || error.message || 'Registration failed';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Cancel user's registration for an event
 * @param {string} eventId
 * @param {Object} currentUser
 * @returns {Promise<{ success: boolean, message: string, data: Object }>}
 */
export async function cancelEventRegistration(eventId, currentUser) {
  try {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        `[Registrations API] Backend offline. Processing cancellation for event #${eventId} via mock adapter.`
      );
      return await mockRegistrationsAdapter.cancel(eventId, currentUser);
    }

    const message =
      error.response?.data?.message || error.message || 'Cancellation failed';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch all registrations for current logged-in user
 * @param {Object} currentUser
 * @returns {Promise<{ success: boolean, data: Array }>}
 */
export async function fetchMyRegistrations(currentUser) {
  try {
    const response = await apiClient.get('/registrations/mine');
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        '[Registrations API] Backend offline. Fetching my registrations via mock adapter.'
      );
      return await mockRegistrationsAdapter.getMyRegistrations(currentUser);
    }

    const message =
      error.response?.data?.message || error.message || 'Failed to fetch registrations';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Helper to check local/mock registration status for an event
 */
export function checkIsRegisteredLocal(eventId, userEmail) {
  return mockRegistrationsAdapter.isUserRegistered(eventId, userEmail);
}
