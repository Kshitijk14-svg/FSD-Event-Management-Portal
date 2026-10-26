import apiClient from './client';
import { mockOrganizerAdapter } from './mockOrganizerAdapter';

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
 * Fetch events organized by the current user
 * GET /api/events/mine
 */
export async function fetchOrganizerEvents(currentUser) {
  try {
    const response = await apiClient.get('/events/mine');
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn('[Organizer API] Backend offline. Using mock organizer adapter.');
      return await mockOrganizerAdapter.getMyEvents(currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to load organizer events';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Create a new event
 * POST /api/events
 */
export async function createEvent(eventData, currentUser) {
  try {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn('[Organizer API] Backend offline. Creating event via mock adapter.');
      return await mockOrganizerAdapter.createEvent(eventData, currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to create event';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Update an existing event
 * PUT /api/events/:id
 */
export async function updateEvent(id, eventData, currentUser) {
  try {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Organizer API] Backend offline. Updating event #${id} via mock adapter.`);
      return await mockOrganizerAdapter.updateEvent(id, eventData, currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to update event';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Delete an event
 * DELETE /api/events/:id
 */
export async function deleteEvent(id, currentUser) {
  try {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Organizer API] Backend offline. Deleting event #${id} via mock adapter.`);
      return await mockOrganizerAdapter.deleteEvent(id, currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to delete event';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch attendee roster for an event
 * GET /api/events/:id/attendees
 */
export async function fetchEventAttendees(id, currentUser) {
  try {
    const response = await apiClient.get(`/events/${id}/attendees`);
    return response.data;
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(`[Organizer API] Backend offline. Fetching attendees for #${id} via mock adapter.`);
      return await mockOrganizerAdapter.getEventAttendees(id, currentUser);
    }
    const message = error.response?.data?.message || error.message || 'Failed to load attendee roster';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}
