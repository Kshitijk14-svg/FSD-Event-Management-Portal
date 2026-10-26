/**
 * Mock Events Adapter for Local Development & Testing.
 *
 * NOTE: This is a clearly separated fallback adapter used strictly when the backend
 * server (http://localhost:5000/api) is unavailable/offline during UI development.
 * It strictly adheres to the shared API response contract:
 * {
 *   success: true,
 *   data: [...],
 *   page: 1,
 *   pages: 2,
 *   total: 10
 * }
 */

// Safe fallback placeholder banner data URL (SVG with modern gradient)
export const DEFAULT_EVENT_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4f46e5" />
          <stop offset="100%" stop-color="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g)" />
      <circle cx="400" cy="200" r="70" fill="rgba(255,255,255,0.15)" />
      <path d="M370 170 h60 v60 h-60 z" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M360 190 h80 M385 160 v20 M415 160 v20" stroke="#ffffff" stroke-width="6" stroke-linecap="round"/>
      <text x="400" y="320" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">College Event Portal</text>
    </svg>
  `);

export const MOCK_EVENTS = [
  {
    _id: '1',
    title: 'HackTech 2026: 36-Hour National Collegiate Hackathon',
    description:
      'Join over 400 passionate student developers, designers, and problem solvers for a 36-hour sprint. Build AI agents, web applications, and hardware solutions. Features 1-on-1 mentorship with industry engineers from top tech companies, hardware lab access, free meals, and $10,000 in cash prizes across 5 competitive tracks.',
    category: 'Technology',
    date: '2026-11-14T09:00:00.000Z',
    venue: 'Main Campus Convention Center & Computer Labs',
    price: 0,
    capacity: 250,
    seatsLeft: 42,
    imageUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Department of Computer Science & ACM Student Chapter',
      email: 'acm.cs@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-15T08:00:00.000Z',
  },
  {
    _id: '2',
    title: 'Resonance 2026: Annual Inter-College Cultural Carnival',
    description:
      'The biggest cultural festival of the academic year featuring inter-collegiate dance battles, battle of the bands, classical music renditions, street plays, and celebrity artist live concerts under the open sky.',
    category: 'Cultural',
    date: '2026-11-20T17:00:00.000Z',
    venue: 'Open-Air Amphitheatre, South Grounds',
    price: 10,
    capacity: 600,
    seatsLeft: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'College Cultural Council & Arts Society',
      email: 'culture@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-18T10:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Hands-On Masterclass: Full-Stack MERN Architecture',
    description:
      'An intensive deep-dive workshop into building production-grade web systems. Learn architecture patterns for React 18, Express REST APIs, MongoDB Mongoose schema design, JWT security, and Docker containerization.',
    category: 'Workshop',
    date: '2026-12-02T14:00:00.000Z',
    venue: 'Seminar Hall 3 & Online Streaming',
    price: 0,
    capacity: 80,
    seatsLeft: 6,
    imageUrl:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Web Innovation Lab',
      email: 'weblab@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-20T12:00:00.000Z',
  },
  {
    _id: '4',
    title: 'Campus Esports Showdown 2026: Valorant & EA Sports',
    description:
      'Compete in our university-wide gaming championship. 5v5 Valorant tournament on 240Hz tournament rigs, followed by 1v1 FIFA 26 showdown on PlayStation 5 consoles. Live shoutcasting and streaming in the student center.',
    category: 'Sports',
    date: '2026-12-10T11:00:00.000Z',
    venue: 'Student Recreation & Esports Arena',
    price: 5,
    capacity: 64,
    seatsLeft: 0, // FULL EVENT FOR TESTING FULL BADGE & BUTTON STATE!
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'University Esports League',
      email: 'esports@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-21T09:00:00.000Z',
  },
  {
    _id: '5',
    title: 'Research Symposium: AI Frontiers & Agentic Coding',
    description:
      'Distinguished keynote sessions with visiting researchers discussing Large Language Models, reasoning frameworks, and autonomous multi-agent developer systems. Peer-reviewed poster presentations by graduate researchers.',
    category: 'Academic',
    date: '2026-12-15T10:00:00.000Z',
    venue: 'Science Block Auditorium, Room 101',
    price: 0,
    capacity: 120,
    seatsLeft: 55,
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Office of Dean (Research & Innovations)',
      email: 'research@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-22T14:30:00.000Z',
  },
  {
    _id: '6',
    title: 'Robotics Workshop: Autonomous Rovers with ROS 2',
    description:
      'Hands-on workshop where student teams program differential-drive robots with LiDAR sensors. Includes microcontrollers, path-planning algorithms, and live obstacle course trials.',
    category: 'Workshop',
    date: '2026-12-18T10:00:00.000Z',
    venue: 'Mechatronics & Embedded Systems Lab',
    price: 15,
    capacity: 40,
    seatsLeft: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Robotics & Automation Society',
      email: 'robotics@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-23T11:00:00.000Z',
  },
  {
    _id: '7',
    title: 'Annual Inter-Hostel Football Cup',
    description:
      'The thrilling 7-a-side football tournament between campus residence halls. Round-robin group stage followed by high-stakes knockout finals under floodlights.',
    category: 'Sports',
    date: '2026-12-22T16:00:00.000Z',
    venue: 'University Main Athletic Stadium',
    price: 0,
    capacity: 200,
    seatsLeft: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Department of Physical Education',
      email: 'sports@college.edu',
    },
    status: 'Published',
    createdAt: '2026-10-24T08:00:00.000Z',
  },
  {
    _id: '8',
    title: 'Orientation Workshop: Git & Open Source Contributions',
    description:
      'A past orientation session introducing first-year students to version control, GitHub workflows, pulling requests, and contributing to open-source student initiatives.',
    category: 'Academic',
    date: '2026-10-10T11:00:00.000Z', // PAST EVENT FOR TESTING "Event ended" STATE!
    venue: 'Auditorium Hall B',
    price: 0,
    capacity: 100,
    seatsLeft: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    organizer: {
      name: 'Open Source Developer Club',
      email: 'osdc@college.edu',
    },
    status: 'Completed',
    createdAt: '2026-09-25T09:00:00.000Z',
  },
];

// Helper delay to simulate realistic network latency
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockEventsAdapter = {
  isMockAdapter: true,

  /**
   * Filter, sort, and paginate events simulating GET /api/events
   */
  async getEvents({ q = '', category = '', from = '', to = '', sort = 'date', page = 1, limit = 6 } = {}) {
    await delay(250);

    let list = [...MOCK_EVENTS];

    // 1. Keyword search (q)
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term) ||
          e.venue.toLowerCase().includes(term)
      );
    }

    // 2. Category filter
    if (category && category !== 'All') {
      list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Start date filter (from)
    if (from) {
      const fromTime = new Date(from).getTime();
      list = list.filter((e) => new Date(e.date).getTime() >= fromTime);
    }

    // 4. End date filter (to)
    if (to) {
      const toTime = new Date(to).getTime();
      list = list.filter((e) => new Date(e.date).getTime() <= toTime);
    }

    // 5. Sorting
    if (sort === 'date') {
      // Earliest first
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === '-date') {
      // Latest first
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === 'newest') {
      // Most recently created first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // 6. Pagination
    const total = list.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 6);
    const pages = Math.max(1, Math.ceil(total / limitNum));
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = list.slice(startIndex, startIndex + limitNum);

    return {
      success: true,
      data: paginatedItems,
      page: pageNum,
      pages,
      total,
      _isMock: true,
    };
  },

  /**
   * Fetch single event by ID simulating GET /api/events/:id
   */
  async getEventById(id) {
    await delay(200);

    const event = MOCK_EVENTS.find((e) => e._id === id || String(e._id) === String(id));

    if (!event) {
      const error = new Error(`Event with ID "${id}" was not found`);
      error.response = {
        status: 404,
        data: {
          success: false,
          message: `Event with ID "${id}" was not found`,
        },
      };
      throw error;
    }

    return {
      success: true,
      data: event,
      _isMock: true,
    };
  },
};
