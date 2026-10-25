const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../server/.env') });

const connectDB = require('../../server/src/config/db');
const { User, Event, Registration } = require('../../server/src/models');

const restoreDatabase = async () => {
  try {
    console.log('--- Restoring Event Portal Database from docs/db-dump ---');
    await connectDB();

    const dumpDir = path.resolve(__dirname, './');
    const usersFile = path.join(dumpDir, 'users.json');
    const eventsFile = path.join(dumpDir, 'events.json');
    const registrationsFile = path.join(dumpDir, 'registrations.json');

    if (!fs.existsSync(usersFile) || !fs.existsSync(eventsFile) || !fs.existsSync(registrationsFile)) {
      throw new Error('Dump files not found in docs/db-dump/. Run npm run seed or npm run dump first.');
    }

    const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
    const registrations = JSON.parse(fs.readFileSync(registrationsFile, 'utf-8'));

    console.log('Wiping current database collections...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
    ]);

    console.log(`Restoring ${users.length} users...`);
    if (users.length > 0) {
      await User.collection.insertMany(users);
    }

    console.log(`Restoring ${events.length} events...`);
    if (events.length > 0) {
      await Event.collection.insertMany(events);
    }

    console.log(`Restoring ${registrations.length} registrations...`);
    if (registrations.length > 0) {
      await Registration.collection.insertMany(registrations);
    }

    console.log('✓ Database restored successfully from JSON dump.');
    process.exit(0);
  } catch (error) {
    console.error('Database restore failed:', error);
    process.exit(1);
  }
};

restoreDatabase();
