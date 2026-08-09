/**
 * Phase 0 demo data.
 *
 * This is LOCAL placeholder data used only to render the UI. It is NOT fetched
 * from the server and is NOT wired to the API client. It will be replaced by
 * real API calls in later phases.
 */

export const mockEvents = [
  {
    id: '1',
    title: 'Spring Music Festival',
    description:
      'A weekend of live music across multiple stages, food trucks and open-air fun.',
    category: 'Music',
    city: 'Pune',
    date: '2026-03-14T18:00:00Z',
    venue: 'College Open Grounds',
    capacity: 500,
    registered: 312,
    status: 'published',
    price: 0,
  },
  {
    id: '2',
    title: 'Tech Fest 2026',
    description:
      'Hackathons, workshops and talks on the latest in software and hardware.',
    category: 'Technology',
    city: 'Mumbai',
    date: '2026-04-02T09:00:00Z',
    venue: 'Main Auditorium',
    capacity: 300,
    registered: 178,
    status: 'published',
    price: 200,
  },
  {
    id: '3',
    title: 'College Dance Night',
    description:
      'An inter-college dance competition with a live DJ and prizes for the winners.',
    category: 'Cultural',
    city: 'Delhi',
    date: '2026-04-20T19:00:00Z',
    venue: 'Community Hall',
    capacity: 250,
    registered: 90,
    status: 'published',
    price: 100,
  },
  {
    id: '4',
    title: 'Startup Pitch Day',
    description:
      'Student startups pitch to a panel of founders and investors. Great networking.',
    category: 'Business',
    city: 'Bengaluru',
    date: '2026-05-05T10:00:00Z',
    venue: 'Innovation Lab',
    capacity: 150,
    registered: 64,
    status: 'published',
    price: 0,
  },
];

export const mockTicket = {
  code: 'TKT-2026-001',
  eventTitle: 'Spring Music Festival',
  eventDate: '2026-03-14T18:00:00Z',
  status: 'confirmed',
};

export const mockStats = {
  totalEvents: 4,
  upcomingEvents: 3,
  myTickets: 1,
  pendingModeration: 2,
};
