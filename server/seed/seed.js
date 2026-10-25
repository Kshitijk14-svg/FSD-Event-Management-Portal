const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const { User, Event, Registration } = require('../src/models');

const seedDatabase = async () => {
  try {
    console.log('--- Starting Event Portal Database Seeding ---');
    await connectDB();

    // 1. Wipe existing collections for clean idempotent seed
    console.log('\nWiping existing collections (User, Event, Registration)...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
    ]);
    console.log('✓ Collections wiped successfully.');

    // 2. Create Users
    console.log('\nCreating seed users...');
    const defaultPassword = 'Password@123';

    // 1 Admin
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@event.com',
      password: defaultPassword,
      role: 'admin',
    });
    await adminUser.save();

    // 3 Organizers
    const organizersData = [
      {
        name: 'Elena Rostova',
        email: 'organizer1@event.com',
        password: defaultPassword,
        role: 'organizer',
      },
      {
        name: 'Marcus Vance',
        email: 'organizer2@event.com',
        password: defaultPassword,
        role: 'organizer',
      },
      {
        name: 'Sophia Chen',
        email: 'organizer3@event.com',
        password: defaultPassword,
        role: 'organizer',
      },
    ];

    const organizers = [];
    for (const orgData of organizersData) {
      const org = new User(orgData);
      await org.save();
      organizers.push(org);
    }

    // 12 Attendees
    const attendeesData = [
      { name: 'Alex Johnson', email: 'attendee1@event.com' },
      { name: 'Priya Sharma', email: 'attendee2@event.com' },
      { name: 'Liam Smith', email: 'attendee3@event.com' },
      { name: 'David Kim', email: 'attendee4@event.com' },
      { name: 'Maya Patel', email: 'attendee5@event.com' },
      { name: 'Chloe Taylor', email: 'attendee6@event.com' },
      { name: 'Ethan Wright', email: 'attendee7@event.com' },
      { name: 'Zoe Miller', email: 'attendee8@event.com' },
      { name: 'Noah Davis', email: 'attendee9@event.com' },
      { name: 'Emma Wilson', email: 'attendee10@event.com' },
      { name: 'Lucas Garcia', email: 'attendee11@event.com' },
      { name: 'Olivia Brown', email: 'attendee12@event.com' },
    ];

    const attendees = [];
    for (const attData of attendeesData) {
      const attendee = new User({
        ...attData,
        password: defaultPassword,
        role: 'attendee',
      });
      await attendee.save();
      attendees.push(attendee);
    }
    console.log(`✓ Created 1 Admin, 3 Organizers, and 12 Attendees.`);

    // 3. Create 24 Events across all categories with mixed past/future dates and varied capacities
    console.log('\nCreating 24 realistic events across all categories...');
    const now = new Date();
    const daysFromNow = (days, hours = 10) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      d.setHours(hours, 0, 0, 0);
      return d;
    };

    const rawEvents = [
      // 1. Tech (Organizer 1)
      {
        title: 'Global AI & Deep Learning Summit 2026',
        description: 'Explore the newest breakthroughs in generative models, agentic workflows, and neural inference with world-class engineers.',
        category: 'Tech',
        date: daysFromNow(5, 9),
        venue: 'Grand Tech Auditorium, Hall A, San Francisco, CA',
        capacity: 150,
        price: 199,
        imageUrl: 'https://picsum.photos/seed/techai1/800/500',
        organizer: organizers[0]._id,
      },
      // 2. Tech - TINY CAPACITY FOR "FULL" DEMO (Organizer 1)
      {
        title: 'Advanced React 19 & Next.js Architecture Masterclass',
        description: 'Ultra-exclusive hands-on code clinic dissecting server components, streaming SSR, and micro-frontend state architecture. Strictly capped at 3 seats.',
        category: 'Workshop',
        date: daysFromNow(8, 14),
        venue: 'Dev Hub Innovation Lab, Room 302, Seattle, WA',
        capacity: 3, // Tiny capacity to demo FULL state
        price: 99,
        imageUrl: 'https://picsum.photos/seed/reactclinic/800/500',
        organizer: organizers[0]._id,
      },
      // 3. Tech (Organizer 1)
      {
        title: 'Cloud Native & Kubernetes Summit',
        description: 'Comprehensive sessions on cloud infrastructure, container orchestration, service meshes, and GitOps pipelines.',
        category: 'Tech',
        date: daysFromNow(12, 10),
        venue: 'Silicon Center Convention Complex, San Jose, CA',
        capacity: 100,
        price: 149,
        imageUrl: 'https://picsum.photos/seed/cloudsummit/800/500',
        organizer: organizers[0]._id,
      },
      // 4. Tech - Free (Organizer 1)
      {
        title: 'Open Source Community Hacknight',
        description: 'Collaborate with fellow open-source contributors, debug PRs, and build impactful developer tooling over pizza and refreshments.',
        category: 'Tech',
        date: daysFromNow(15, 18),
        venue: 'Co-Work Collective, Downtown Austin, TX',
        capacity: 40,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/hacknight/800/500',
        organizer: organizers[0]._id,
      },

      // 5. Music (Organizer 2)
      {
        title: 'Indie Soundwave Festival 2026',
        description: 'A vibrant outdoor gathering featuring breakthrough indie rock bands, synth-pop producers, and craft beverage stations.',
        category: 'Music',
        date: daysFromNow(6, 17),
        venue: 'Riverside Amphitheater, Austin, TX',
        capacity: 250,
        price: 45,
        imageUrl: 'https://picsum.photos/seed/indiefest/800/500',
        organizer: organizers[1]._id,
      },
      // 6. Music (Organizer 2)
      {
        title: 'Acoustic Soul Sessions Live',
        description: 'An intimate candlelit evening of acoustic guitar, vocal harmonies, and warm storytelling in a historic cathedral setting.',
        category: 'Music',
        date: daysFromNow(11, 20),
        venue: 'Old Town Heritage Hall, Nashville, TN',
        capacity: 60,
        price: 30,
        imageUrl: 'https://picsum.photos/seed/acousticsoul/800/500',
        organizer: organizers[1]._id,
      },
      // 7. Music - Free (Organizer 2)
      {
        title: 'Sunset Jazz & Blues in the Park',
        description: 'Relax on the lawn with live brass ensembles and blues quartets under the golden twilight sky. Family and pet friendly.',
        category: 'Music',
        date: daysFromNow(18, 18),
        venue: 'Centennial Park Bandshell, Denver, CO',
        capacity: 200,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/jazzpark/800/500',
        organizer: organizers[1]._id,
      },

      // 8. Sports (Organizer 3)
      {
        title: 'Metro 10K & Half Marathon 2026',
        description: 'Scenic certified race course crossing metropolitan suspension bridges and downtown riverfront promenades.',
        category: 'Sports',
        date: daysFromNow(14, 6),
        venue: 'Memorial Park Start Plaza, Boston, MA',
        capacity: 500,
        price: 35,
        imageUrl: 'https://picsum.photos/seed/halfmarathon/800/500',
        organizer: organizers[2]._id,
      },
      // 9. Sports (Organizer 3)
      {
        title: 'Corporate Badminton Championship',
        description: 'Annual inter-company doubles badminton tournament with brackets for intermediate and competitive leagues.',
        category: 'Sports',
        date: daysFromNow(20, 9),
        venue: 'Metropolitan Racquet Club, Chicago, IL',
        capacity: 32,
        price: 20,
        imageUrl: 'https://picsum.photos/seed/badmintonchamps/800/500',
        organizer: organizers[2]._id,
      },
      // 10. Sports - Free (Organizer 3)
      {
        title: '3v3 Streetball Showdown',
        description: 'Fast-paced street basketball tournament with DJ sets, three-point shootouts, and championship trophies.',
        category: 'Sports',
        date: daysFromNow(22, 11),
        venue: 'Venice Beach Recreation Courts, Los Angeles, CA',
        capacity: 24,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/streetball/800/500',
        organizer: organizers[2]._id,
      },

      // 11. Workshop (Organizer 1)
      {
        title: 'UI/UX Design Systems Sprint',
        description: 'Practical design tokens workshop: building accessible, scalable multi-brand component architectures using Figma and code.',
        category: 'Workshop',
        date: daysFromNow(7, 13),
        venue: 'Design Loft Studio, New York, NY',
        capacity: 25,
        price: 75,
        imageUrl: 'https://picsum.photos/seed/uxsprint/800/500',
        organizer: organizers[0]._id,
      },
      // 12. Workshop (Organizer 1)
      {
        title: 'Hands-on Robotics & Arduino Lab',
        description: 'Build sensor-driven obstacle-avoiding rovers and master micro-controller firmware programming in one intensive day.',
        category: 'Workshop',
        date: daysFromNow(16, 10),
        venue: 'MakerSpace Innovation Garage, Pittsburgh, PA',
        capacity: 20,
        price: 60,
        imageUrl: 'https://picsum.photos/seed/roboticslab/800/500',
        organizer: organizers[0]._id,
      },
      // 13. Workshop - Free (Organizer 1)
      {
        title: 'Creative Non-Fiction Writing Bootcamp',
        description: 'Unleash your narrative voice with published essayists. Writing prompts, live critique groups, and publishing advice.',
        category: 'Workshop',
        date: daysFromNow(24, 15),
        venue: 'Public Library Cultural Auditorium, Portland, OR',
        capacity: 30,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/writingbootcamp/800/500',
        organizer: organizers[0]._id,
      },

      // 14. Cultural (Organizer 3)
      {
        title: 'International Gastronomy Food & Wine Expo',
        description: 'Tasting pavilion featuring artisan cheeses, heritage wines, and delicacies from award-winning master chefs worldwide.',
        category: 'Cultural',
        date: daysFromNow(9, 12),
        venue: 'Pier 48 Waterfront Pavilion, San Francisco, CA',
        capacity: 180,
        price: 80,
        imageUrl: 'https://picsum.photos/seed/foodexpo/800/500',
        organizer: organizers[2]._id,
      },
      // 15. Cultural (Organizer 3)
      {
        title: 'Heritage Traditional Folk & Arts Festival',
        description: 'Celebrate multicultural traditions through indigenous crafts, vibrant textiles, live dance, and culinary heritage.',
        category: 'Cultural',
        date: daysFromNow(21, 10),
        venue: 'Heritage Cultural Center, Santa Fe, NM',
        capacity: 120,
        price: 15,
        imageUrl: 'https://picsum.photos/seed/folkarts/800/500',
        organizer: organizers[2]._id,
      },
      // 16. Cultural - Free (Organizer 3)
      {
        title: 'Open Air World Cinema Showcase',
        description: 'Curated selection of award-winning international foreign feature films projected under the night sky with subtitles.',
        category: 'Cultural',
        date: daysFromNow(27, 20),
        venue: 'Mission Dolores Park, San Francisco, CA',
        capacity: 150,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/worldcinema/800/500',
        organizer: organizers[2]._id,
      },

      // 17. Business (Organizer 2)
      {
        title: 'Fintech Horizons & Web3 Capital Conference',
        description: 'Keynote panels on decentralized finance, cross-border payments, neo-banking, and institutional regulation.',
        category: 'Business',
        date: daysFromNow(10, 9),
        venue: 'Financial District Conference Tower, New York, NY',
        capacity: 90,
        price: 160,
        imageUrl: 'https://picsum.photos/seed/fintechconf/800/500',
        organizer: organizers[1]._id,
      },
      // 18. Business (Organizer 2)
      {
        title: 'Seed-Stage Startup Pitch Night',
        description: 'Ten selected early-stage startups pitch in front of active angel investors and seed venture capital firms.',
        category: 'Business',
        date: daysFromNow(17, 18),
        venue: 'Venture Capital Incubator Loft, Boulder, CO',
        capacity: 50,
        price: 25,
        imageUrl: 'https://picsum.photos/seed/pitchnight/800/500',
        organizer: organizers[1]._id,
      },
      // 19. Business - Almost Full (Organizer 2)
      {
        title: 'Executive C-Suite Roundtable on AI Governance',
        description: 'Confidential strategic forum on enterprise regulatory compliance, risk mitigation, and algorithmic accountability.',
        category: 'Business',
        date: daysFromNow(25, 12),
        venue: 'St. Regis Executive Boardroom, Washington, DC',
        capacity: 5, // 5 seats
        price: 250,
        imageUrl: 'https://picsum.photos/seed/csuiteround/800/500',
        organizer: organizers[1]._id,
      },
      // 20. Business - Free (Organizer 2)
      {
        title: 'Freelancers & Agency Founders Meetup',
        description: 'Networking and collaborative knowledge sharing on client acquisition, retainer pricing, and subcontractor scaling.',
        category: 'Business',
        date: daysFromNow(28, 17),
        venue: 'The Atrium Community Workspace, Miami, FL',
        capacity: 45,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/freelancersmeet/800/500',
        organizer: organizers[1]._id,
      },

      // 21. Other (Organizer 3)
      {
        title: 'Stargazing & Astrophotography Expedition',
        description: 'Guided deep-sky observing session with high-powered telescopes under certified dark skies. Learn long-exposure camera capture.',
        category: 'Other',
        date: daysFromNow(13, 21),
        venue: 'Joshua Tree Dark Sky Observation Camp, CA',
        capacity: 35,
        price: 40,
        imageUrl: 'https://picsum.photos/seed/stargazing/800/500',
        organizer: organizers[2]._id,
      },
      // 22. Other (Organizer 3)
      {
        title: 'Mindful Sound Healing & Yoga Immersion',
        description: 'Restore physical vitality and mental calm with Tibetan singing bowls, gongs, and gentle restorative vinyasa yoga.',
        category: 'Other',
        date: daysFromNow(19, 10),
        venue: 'Lotus Sanctuary Studio, Sedona, AZ',
        capacity: 25,
        price: 30,
        imageUrl: 'https://picsum.photos/seed/mindfulyoga/800/500',
        organizer: organizers[2]._id,
      },

      // 23. Past Event 1 (Organizer 1)
      {
        title: 'Past: Web Performance & Lighthouse Audit Clinic',
        description: 'Archived session from last month analyzing core web vitals, bundle splitting, and hydration bottlenecks.',
        category: 'Tech',
        date: daysFromNow(-14, 10),
        venue: 'Online Tech Theater, San Francisco, CA',
        capacity: 100,
        price: 0,
        imageUrl: 'https://picsum.photos/seed/pasttechclinic/800/500',
        organizer: organizers[0]._id,
      },
      // 24. Past Event 2 (Organizer 2)
      {
        title: 'Past: Winter Chamber Orchestra Gala',
        description: 'Archived classical performance featuring Mozart concertos and contemporary string compositions.',
        category: 'Music',
        date: daysFromNow(-7, 19),
        venue: 'Symphony Center Concert Hall, Chicago, IL',
        capacity: 120,
        price: 50,
        imageUrl: 'https://picsum.photos/seed/pastorchestra/800/500',
        organizer: organizers[1]._id,
      },
    ];

    const savedEvents = [];
    for (const evt of rawEvents) {
      const newEvent = new Event({
        ...evt,
        registeredCount: 0,
      });
      await newEvent.save();
      savedEvents.push(newEvent);
    }
    console.log(`✓ Created ${savedEvents.length} events across all 7 categories.`);

    // 4. Create ~60 Registrations with rigorous consistency
    // Event 1 (index 1 in rawEvents: "Advanced React 19..." capacity = 3): FULL EVENT with 3 attendees
    console.log('\nCreating ~60 registrations with strict compound unique constraints...');
    const registrationPairs = [
      // Full event demo: Event index 1 (Capacity 3) -> 3 attendees (attendees 0, 1, 2)
      [0, 1],
      [1, 1],
      [2, 1],

      // Event index 18 (Capacity 5: "Executive C-Suite...") -> 4 attendees (1 seat left)
      [0, 18],
      [1, 18],
      [3, 18],
      [4, 18],

      // Event index 0 (Global AI Summit, Capacity 150) -> 8 attendees
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
      [6, 0],
      [7, 0],

      // Event index 2 (Cloud Native, Capacity 100) -> 5 attendees
      [0, 2],
      [2, 2],
      [4, 2],
      [6, 2],
      [8, 2],

      // Event index 3 (Hacknight Free, Capacity 40) -> 6 attendees
      [1, 3],
      [3, 3],
      [5, 3],
      [7, 3],
      [9, 3],
      [11, 3],

      // Event index 4 (Indie Soundwave, Capacity 250) -> 6 attendees
      [0, 4],
      [2, 4],
      [4, 4],
      [7, 4],
      [8, 4],
      [10, 4],

      // Event index 5 (Acoustic Soul, Capacity 60) -> 4 attendees
      [1, 5],
      [5, 5],
      [9, 5],
      [11, 5],

      // Event index 6 (Sunset Jazz, Capacity 200) -> 4 attendees
      [2, 6],
      [4, 6],
      [6, 6],
      [8, 6],

      // Event index 7 (Metro 10K, Capacity 500) -> 5 attendees
      [0, 7],
      [3, 7],
      [6, 7],
      [9, 7],
      [11, 7],

      // Event index 8 (Badminton, Capacity 32) -> 3 attendees
      [1, 8],
      [4, 8],
      [7, 8],

      // Event index 10 (UI/UX Sprint, Capacity 25) -> 4 attendees
      [0, 10],
      [2, 10],
      [5, 10],
      [8, 10],

      // Event index 13 (Gastronomy Expo, Capacity 180) -> 4 attendees
      [3, 13],
      [6, 13],
      [9, 13],
      [11, 13],

      // Event index 16 (Fintech Horizons, Capacity 90) -> 3 attendees
      [0, 16],
      [4, 16],
      [8, 16],

      // Event index 20 (Stargazing Expedition, Capacity 35) -> 3 attendees
      [2, 20],
      [5, 20],
      [10, 20],

      // Past Event index 22 (Past Web Performance) -> 2 attendees
      [1, 22],
      [7, 22],
    ];

    const countsPerEvent = {};

    for (const [attendeeIdx, eventIdx] of registrationPairs) {
      const user = attendees[attendeeIdx];
      const event = savedEvents[eventIdx];

      const reg = new Registration({
        user: user._id,
        event: event._id,
        status: 'registered',
      });
      await reg.save();

      countsPerEvent[event._id] = (countsPerEvent[event._id] || 0) + 1;
    }

    // Synchronize event registeredCount with active registrations
    for (const event of savedEvents) {
      const count = countsPerEvent[event._id] || 0;
      event.registeredCount = count;
      await event.save();
    }

    console.log(`✓ Inserted ${registrationPairs.length} active registrations.`);

    // 5. Verification summary of seeded data
    const fullEvent = await Event.findById(savedEvents[1]._id);

    console.log('\n======================================================');
    console.log('            DATABASE SEEDING COMPLETE                 ');
    console.log('======================================================');
    console.log(`Total Users         : 16 (1 Admin, 3 Organizers, 12 Attendees)`);
    console.log(`Total Events        : ${savedEvents.length}`);
    console.log(`Total Registrations : ${registrationPairs.length}`);
    console.log(`Featured Full Event : "${fullEvent.title}"`);
    console.log(`                      Capacity: ${fullEvent.capacity} | Registered: ${fullEvent.registeredCount} | isFull: ${fullEvent.isFull} | seatsLeft: ${fullEvent.seatsLeft}`);
    console.log('------------------------------------------------------');
    console.log('DEMO ACCOUNTS (All passwords: Password@123):');
    console.log('  [Admin]      admin@event.com');
    console.log('  [Organizer]  organizer1@event.com  (Elena Rostova)');
    console.log('  [Organizer]  organizer2@event.com  (Marcus Vance)');
    console.log('  [Organizer]  organizer3@event.com  (Sophia Chen)');
    console.log('  [Attendee]   attendee1@event.com   to  attendee12@event.com');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
};

seedDatabase();
