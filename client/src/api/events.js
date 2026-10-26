import apiClient from './client';
import { mockEventsAdapter } from './mockEventsAdapter';

/**
 * Events API Service
 * Handles communication with the backend event endpoints:
 *   GET /api/events     -> apiClient.get('/events', { params })
 *   GET /api/events/:id -> apiClient.get('/events/' + id)
 *
 * If the backend server is offline or unreachable, it falls back to
 * mockEventsAdapter for local testing.
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
 * Fetch list of events with query filtering, sorting, and pagination
 * @param {Object} queryParams - { q, category, from, to, sort, page, limit }
 * @returns {Promise<{ success: boolean, data: Array, page: number, pages: number, total: number }>}
 */
export async function fetchEvents(queryParams = {}) {
  // Clean up empty parameters before sending
  const cleanedParams = {};
  Object.entries(queryParams).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'All') {
      cleanedParams[key] = val;
    }
  });

  try {
    const response = await apiClient.get('/events', { params: cleanedParams });
    const payload = response.data;

    // Adapt to shared list response contract
    return {
      success: payload.success ?? true,
      data: payload.data || [],
      page: payload.page || 1,
      pages: payload.pages || 1,
      total: payload.total !== undefined ? payload.total : (payload.data || []).length,
      _isMock: false,
    };
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        '[Events API] Backend server at http://localhost:5000/api is offline. Using mockEventsAdapter.'
      );
      return await mockEventsAdapter.getEvents(queryParams);
    }

    const message =
      error.response?.data?.message || error.message || 'Failed to fetch events';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}

/**
 * Fetch single event details by its ID
 * @param {string} id - Event ID
 * @returns {Promise<Object>} Event detail object
 */
export async function fetchEventById(id) {
  if (!id) {
    throw new Error('Event ID is required');
  }

  try {
    const response = await apiClient.get(`/events/${id}`);
    const payload = response.data;

    if (payload.success && payload.data) {
      return {
        ...payload.data,
        _isMock: false,
      };
    }
    throw new Error(payload.message || 'Failed to fetch event details');
  } catch (error) {
    if (isNetworkOfflineError(error)) {
      console.warn(
        `[Events API] Backend server is offline. Fetching event #${id} via mockEventsAdapter.`
      );
      const mockResult = await mockEventsAdapter.getEventById(id);
      return mockResult.data;
    }

    const message =
      error.response?.data?.message ||
      (error.response?.status === 404 ? `Event with ID "${id}" was not found` : error.message) ||
      'Failed to load event';
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    throw enhancedError;
  }
}
