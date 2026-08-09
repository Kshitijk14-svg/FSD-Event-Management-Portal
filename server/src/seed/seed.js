import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/event_portal_db';

export async function seedDatabase() {
  console.log('=== Starting Phase 0 Database Seeding & Schema Verification ===');

  try {
    // 1. Connect to Database
    await connectDB(MONGO_URI);

    // 2. Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    console.log('[Seed] Database cleared.');

    // 3. Seed Users
    console.log('[Seed] Inserting sample users...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eventportal.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+15550001111',
    });

    const organizer = await User.create({
      name: 'Jane Tech Organizer',
      email: 'jane@techconf.org',
      password: 'OrganizerPassword123!',
      role: 'organizer',
      phone: '+15550002222',
    });

    const attendee = await User.create({
      name: 'Alex Attendee',
      email: 'alex@example.com',
      password: 'AttendeePassword123!',
      role: 'attendee',
      phone: '+15550003333',
    });

    console.log(`[Seed] Seeded 3 users (Admin, Organizer, Attendee).`);

    // Verify Password Hashing & comparePassword
    const fetchedUser = await User.findById(organizer._id).select('+password');
    const isPasswordCorrect = await fetchedUser.comparePassword('OrganizerPassword123!');
    console.log(`[Verify] Password Hashing & comparePassword check: ${isPasswordCorrect ? 'PASSED ✅' : 'FAILED ❌'}`);

    // Verify toJSON password omission
    const userJson = organizer.toJSON();
    const isPasswordOmitted = userJson.password === undefined && userJson.__v === undefined;
    console.log(`[Verify] toJSON transform (omitting password & __v) check: ${isPasswordOmitted ? 'PASSED ✅' : 'FAILED ❌'}`);

    // 4. Seed Events
    console.log('[Seed] Inserting sample events...');
    const event1 = await Event.create({
      title: 'Global AI & Cloud Summit 2026',
      slug: 'global-ai-cloud-summit-2026',
      description: 'A premiere gathering of AI developers, engineers, and tech visionaries.',
      category: 'tech',
      organizer: organizer._id,
      venue: {
        name: 'Silicon Valley Convention Center',
        address: '500 Innovation Way',
        city: 'San Jose',
      },
      startAt: new Date(Date.now() + 86400000 * 30),
      endAt: new Date(Date.now() + 86400000 * 30 + 3600000 * 8),
      capacity: 250,
      seatsBooked: 1,
      price: 199.99,
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      status: 'published',
      tags: ['AI', 'Cloud', 'Machine Learning'],
    });

    const event2 = await Event.create({
      title: 'Spring Music & Cultural Fest',
      slug: 'spring-music-cultural-fest',
      description: 'Live acoustic music, food trucks, and regional art exhibitions.',
      category: 'cultural',
      organizer: organizer._id,
      venue: {
        name: 'Metropolitan Park Outdoor Stage',
        address: '100 Green Park Road',
        city: 'Austin',
      },
      startAt: new Date(Date.now() + 86400000 * 45),
      endAt: new Date(Date.now() + 86400000 * 45 + 3600000 * 6),
      capacity: 1000,
      seatsBooked: 0,
      price: 0,
      status: 'pending',
      tags: ['music', 'culture', 'festival'],
    });

    console.log(`[Seed] Seeded 2 events.`);

    // Verify Virtual Field seatsRemaining
    console.log(`[Verify] Event seatsRemaining Virtual: ${event1.seatsRemaining} / ${event1.capacity} (Expected 249): ${event1.seatsRemaining === 249 ? 'PASSED ✅' : 'FAILED ❌'}`);

    // Verify Date Validator (endAt must be after startAt)
    try {
      await Event.create({
        title: 'Invalid Date Event',
        slug: 'invalid-date-event',
        description: 'Should fail validation because endAt is before startAt',
        category: 'workshop',
        organizer: organizer._id,
        venue: { name: 'Test Venue', city: 'Test City' },
        startAt: new Date('2026-10-10T10:00:00Z'),
        endAt: new Date('2026-10-10T08:00:00Z'),
        capacity: 50,
      });
      console.log('[Verify] Date Validator check: FAILED ❌ (Invalid date should have thrown validation error)');
    } catch (valErr) {
      console.log('[Verify] Date Validator check (endAt > startAt): PASSED ✅ (Caught expected validation error)');
    }

    // 5. Seed Registration
    console.log('[Seed] Inserting sample registration...');
    const registration = await Registration.create({
      event: event1._id,
      user: attendee._id,
      ticketCode: 'tkt-ai2026-001',
      status: 'confirmed',
    });

    console.log(`[Verify] Registration uppercase ticketCode transform check: ${registration.ticketCode === 'TKT-AI2026-001' ? 'PASSED ✅' : 'FAILED ❌'}`);

    console.log('=== Seeding & Verification Completed Successfully ===');
  } catch (error) {
    console.error('Fatal Error during database seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('[MongoDB] Connection closed after seeding.');
  }
}

if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase();
}

export default seedDatabase;
