import { MOCK_EVENTS } from './mockEventsAdapter';

/**
 * Mock Registrations Adapter for Local Development & Testing.
 *
 * NOTE: Used strictly when the backend server (http://localhost:5000/api) is
 * offline during frontend development. It strictly implements the backend
 * business rules and returns matching contracts.
 */

const STORAGE_KEY = 'mock_event_registrations';

// Helper to load stored registrations
function getStoredRegistrations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Default sample registration for attendee@college.edu on Event #3
      const sample = [
        {
          _id: 'reg_init_101',
          eventId: '3',
          event: MOCK_EVENTS.find((e) => e._id === '3') || MOCK_EVENTS[2],
          userEmail: 'attendee@college.edu',
          userName: 'Kunal Sharma',
          status: 'confirmed',
          createdAt: '2026-10-24T10:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredRegistrations(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save mock registrations', err);
  }
}

// Simulates realistic network latency
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockRegistrationsAdapter = {
  isMockAdapter: true,

  /**
   * Register user for an event (simulating POST /api/events/:id/register)
   */
  async register(eventId, currentUser) {
    await delay(300);

    if (!currentUser) {
      const err = new Error('You must be logged in to register for events');
      err.response = { status: 401, data: { success: false, message: 'Authentication required' } };
      throw err;
    }

    const event = MOCK_EVENTS.find((e) => String(e._id) === String(eventId));
    if (!event) {
      const err = new Error(`Event #${eventId} not found`);
      err.response = { status: 404, data: { success: false, message: 'Event not found' } };
      throw err;
    }

    // Business rule: No registration for past events
    const isPast = event.date && new Date(event.date).getTime() < Date.now();
    if (isPast) {
      const err = new Error('Cannot register for an event that has already ended');
      err.response = { status: 400, data: { success: false, message: 'Cannot register for past events' } };
      throw err;
    }

    // Business rule: No registration when event is full
    if (event.seatsLeft <= 0) {
      const err = new Error('Event is already full. No seats remaining.');
      err.response = { status: 400, data: { success: false, message: 'Event is already full' } };
      throw err;
    }

    // Business rule: No registration for organizer's own event
    const organizerEmail = typeof event.organizer === 'object' ? event.organizer.email : '';
    if (organizerEmail && organizerEmail.toLowerCase() === currentUser.email?.toLowerCase()) {
      const err = new Error('Organizers cannot register for their own events');
      err.response = { status: 403, data: { success: false, message: 'Cannot register for your own event' } };
      throw err;
    }

    const list = getStoredRegistrations();
    const existing = list.find(
      (r) =>
        String(r.eventId) === String(eventId) &&
        r.userEmail?.toLowerCase() === currentUser.email?.toLowerCase() &&
        r.status === 'confirmed'
    );

    // Business rule: No duplicate active registrations
    if (existing) {
      const err = new Error('You are already registered for this event');
      err.response = { status: 409, data: { success: false, message: 'Already registered for this event' } };
      throw err;
    }

    // Decrement seatsLeft on the event
    event.seatsLeft = Math.max(0, event.seatsLeft - 1);

    const newRegistration = {
      _id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventId: String(event._id),
      event: { ...event },
      userEmail: currentUser.email,
      userName: currentUser.name,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    list.push(newRegistration);
    saveStoredRegistrations(list);

    return {
      success: true,
      message: 'Successfully registered for event',
      data: {
        registration: newRegistration,
        seatsLeft: event.seatsLeft,
      },
      _isMock: true,
    };
  },

  /**
   * Cancel user registration for an event (simulating DELETE /api/events/:id/register)
   */
  async cancel(eventId, currentUser) {
    await delay(300);

    if (!currentUser) {
      const err = new Error('Authentication required');
      err.response = { status: 401, data: { success: false, message: 'Authentication required' } };
      throw err;
    }

    const list = getStoredRegistrations();
    const regIndex = list.findIndex(
      (r) =>
        String(r.eventId) === String(eventId) &&
        r.userEmail?.toLowerCase() === currentUser.email?.toLowerCase() &&
        r.status === 'confirmed'
    );

    if (regIndex === -1) {
      const err = new Error('Active registration not found for this event');
      err.response = { status: 404, data: { success: false, message: 'Registration not found or already cancelled' } };
      throw err;
    }

    const reg = list[regIndex];
    // Check if event has already ended
    const isPast = reg.event?.date && new Date(reg.event.date).getTime() < Date.now();
    if (isPast) {
      const err = new Error('Cannot cancel registration for an event that has already ended');
      err.response = { status: 400, data: { success: false, message: 'Cannot cancel registration for past events' } };
      throw err;
    }

    // Remove active registration
    list.splice(regIndex, 1);
    saveStoredRegistrations(list);

    // Increment seats on the event
    const event = MOCK_EVENTS.find((e) => String(e._id) === String(eventId));
    let updatedSeats = 1;
    if (event) {
      event.seatsLeft = Math.min(event.capacity || 100, event.seatsLeft + 1);
      updatedSeats = event.seatsLeft;
    }

    return {
      success: true,
      message: 'Registration cancelled successfully',
      data: {
        seatsLeft: updatedSeats,
      },
      _isMock: true,
    };
  },

  /**
   * Get all registrations for current user (simulating GET /api/registrations/mine)
   */
  async getMyRegistrations(currentUser) {
    await delay(250);

    if (!currentUser) {
      const err = new Error('Authentication required');
      err.response = { status: 401, data: { success: false, message: 'Authentication required' } };
      throw err;
    }

    const list = getStoredRegistrations();
    const userRegs = list.filter(
      (r) => r.userEmail?.toLowerCase() === currentUser.email?.toLowerCase()
    );

    // Ensure populated event data reflects current event definitions
    const populated = userRegs.map((reg) => {
      const currentEvent = MOCK_EVENTS.find((e) => String(e._id) === String(reg.eventId)) || reg.event;
      return {
        ...reg,
        event: currentEvent,
      };
    });

    return {
      success: true,
      data: populated,
      _isMock: true,
    };
  },

  /**
   * Check if user is registered for an event
   */
  isUserRegistered(eventId, userEmail) {
    if (!eventId || !userEmail) return false;
    const list = getStoredRegistrations();
    return list.some(
      (r) =>
        String(r.eventId) === String(eventId) &&
        r.userEmail?.toLowerCase() === userEmail.toLowerCase() &&
        r.status === 'confirmed'
    );
  },
};
