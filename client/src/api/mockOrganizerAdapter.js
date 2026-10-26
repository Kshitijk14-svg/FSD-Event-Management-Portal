import { MOCK_EVENTS } from './mockEventsAdapter';

/**
 * Mock Organizer Adapter for Local Development & Testing.
 *
 * Simulates backend organizer endpoints:
 *   GET    /api/events/mine
 *   POST   /api/events
 *   PUT    /api/events/:id
 *   DELETE /api/events/:id
 *   GET    /api/events/:id/attendees
 */

const STORAGE_EVENTS_KEY = 'mock_organizer_events_store';

function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_EVENTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(MOCK_EVENTS));
      return MOCK_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_EVENTS;
  }
}

function saveStoredEvents(events) {
  try {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save organizer events', err);
  }
}

// Sample attendee rosters per event
const SAMPLE_ATTENDEES = [
  {
    attendeeId: 'usr_att_101',
    name: 'Kunal Sharma',
    email: 'attendee@college.edu',
    registeredAt: '2026-10-24T14:30:00.000Z',
    ticketId: 'TKT-2026-8841',
  },
  {
    attendeeId: 'usr_att_102',
    name: 'Aarav Patel',
    email: 'aarav.p@college.edu',
    registeredAt: '2026-10-24T16:15:00.000Z',
    ticketId: 'TKT-2026-8842',
  },
  {
    attendeeId: 'usr_att_103',
    name: 'Priya Iyer',
    email: 'priya.i@college.edu',
    registeredAt: '2026-10-25T09:20:00.000Z',
    ticketId: 'TKT-2026-8843',
  },
  {
    attendeeId: 'usr_att_104',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@college.edu',
    registeredAt: '2026-10-25T11:45:00.000Z',
    ticketId: 'TKT-2026-8844',
  },
];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockOrganizerAdapter = {
  isMockAdapter: true,

  async getMyEvents(currentUser) {
    await delay(250);
    const events = getStoredEvents();

    // In a real backend, events matching organizer's user ID are returned.
    // For mock testing, return events where organizer email matches or all if admin/demo.
    const userEmail = currentUser?.email?.toLowerCase() || '';
    const myEvents = events.filter((e) => {
      const orgEmail = typeof e.organizer === 'object' ? e.organizer?.email?.toLowerCase() : '';
      return (
        orgEmail === userEmail ||
        e.organizer?.name?.toLowerCase().includes('verma') ||
        e.organizer?.name?.toLowerCase().includes('organizer') ||
        currentUser?.role === 'admin'
      );
    });

    return {
      success: true,
      data: myEvents.length > 0 ? myEvents : events.slice(0, 4),
      _isMock: true,
    };
  },

  async createEvent(eventData, currentUser) {
    await delay(350);
    const events = getStoredEvents();

    const capacityNum = parseInt(eventData.capacity, 10);
    const newEvent = {
      _id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      category: eventData.category,
      date: new Date(eventData.date).toISOString(),
      venue: eventData.venue.trim(),
      capacity: capacityNum,
      seatsLeft: capacityNum, // Initial seats equal capacity
      price: parseFloat(eventData.price) || 0,
      imageUrl: eventData.imageUrl?.trim() || '',
      organizer: {
        name: currentUser?.name || 'Faculty Organizer',
        email: currentUser?.email || 'organizer@college.edu',
      },
      status: 'Published',
      createdAt: new Date().toISOString(),
    };

    events.unshift(newEvent);
    saveStoredEvents(events);

    // Also update MOCK_EVENTS in memory
    MOCK_EVENTS.unshift(newEvent);

    return {
      success: true,
      message: 'Event created and published successfully',
      data: newEvent,
      _isMock: true,
    };
  },

  async updateEvent(id, eventData, _currentUser) {
    await delay(300);
    const events = getStoredEvents();
    const index = events.findIndex((e) => String(e._id) === String(id));

    if (index === -1) {
      const err = new Error(`Event #${id} not found`);
      err.response = { status: 404, data: { success: false, message: 'Event not found' } };
      throw err;
    }

    const current = events[index];
    const capacityNum = parseInt(eventData.capacity, 10);
    const diff = capacityNum - current.capacity;
    const updatedSeatsLeft = Math.max(0, (current.seatsLeft || 0) + diff);

    const updatedEvent = {
      ...current,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      category: eventData.category,
      date: new Date(eventData.date).toISOString(),
      venue: eventData.venue.trim(),
      capacity: capacityNum,
      seatsLeft: updatedSeatsLeft,
      price: parseFloat(eventData.price) || 0,
      imageUrl: eventData.imageUrl !== undefined ? eventData.imageUrl.trim() : current.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updatedEvent;
    saveStoredEvents(events);

    // Update in-memory MOCK_EVENTS
    const memIdx = MOCK_EVENTS.findIndex((e) => String(e._id) === String(id));
    if (memIdx !== -1) {
      MOCK_EVENTS[memIdx] = updatedEvent;
    }

    return {
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
      _isMock: true,
    };
  },

  async deleteEvent(id, _currentUser) {
    await delay(250);
    const events = getStoredEvents();
    const index = events.findIndex((e) => String(e._id) === String(id));

    if (index === -1) {
      const err = new Error(`Event #${id} not found`);
      err.response = { status: 404, data: { success: false, message: 'Event not found' } };
      throw err;
    }

    events.splice(index, 1);
    saveStoredEvents(events);

    // Remove from in-memory MOCK_EVENTS
    const memIdx = MOCK_EVENTS.findIndex((e) => String(e._id) === String(id));
    if (memIdx !== -1) {
      MOCK_EVENTS.splice(memIdx, 1);
    }

    return {
      success: true,
      message: 'Event deleted successfully',
      data: { id },
      _isMock: true,
    };
  },

  async getEventAttendees(id, _currentUser) {
    await delay(250);
    const events = getStoredEvents();
    const event = events.find((e) => String(e._id) === String(id));

    if (!event) {
      const err = new Error(`Event #${id} not found`);
      err.response = { status: 404, data: { success: false, message: 'Event not found' } };
      throw err;
    }

    // Generate realistic roster matching registered count
    const registeredCount = Math.max(0, (event.capacity || 50) - (event.seatsLeft !== undefined ? event.seatsLeft : 10));
    const roster = SAMPLE_ATTENDEES.slice(0, Math.min(registeredCount || 2, SAMPLE_ATTENDEES.length));

    return {
      success: true,
      data: {
        event: {
          _id: event._id,
          title: event.title,
          capacity: event.capacity,
          seatsLeft: event.seatsLeft,
          registeredCount,
        },
        attendees: roster,
      },
      _isMock: true,
    };
  },
};
