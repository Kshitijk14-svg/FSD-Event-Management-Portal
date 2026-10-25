const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const { User, Event, Registration } = require('../src/models');

const exportDump = async () => {
  try {
    console.log('--- Exporting Event Portal Database to JSON Dump ---');
    await connectDB();

    const dumpDir = path.resolve(__dirname, '../../docs/db-dump');
    if (!fs.existsSync(dumpDir)) {
      fs.mkdirSync(dumpDir, { recursive: true });
    }

    const [users, events, registrations] = await Promise.all([
      User.find({}).select('+password').lean(),
      Event.find({}).lean(),
      Registration.find({}).lean(),
    ]);

    fs.writeFileSync(
      path.join(dumpDir, 'users.json'),
      JSON.stringify(users, null, 2),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(dumpDir, 'events.json'),
      JSON.stringify(events, null, 2),
      'utf-8'
    );
    fs.writeFileSync(
      path.join(dumpDir, 'registrations.json'),
      JSON.stringify(registrations, null, 2),
      'utf-8'
    );

    console.log(`✓ Exported ${users.length} users to docs/db-dump/users.json`);
    console.log(`✓ Exported ${events.length} events to docs/db-dump/events.json`);
    console.log(`✓ Exported ${registrations.length} registrations to docs/db-dump/registrations.json`);
    console.log('--- Export completed successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
};

exportDump();
