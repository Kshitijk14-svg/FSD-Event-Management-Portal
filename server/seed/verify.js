const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../src/config/db');
const { User, Event, Registration } = require('../src/models');

const runIntegrityChecks = async () => {
  let passedAll = true;

  try {
    console.log('--- Running Event Portal Database Integrity Verification ---\n');
    await connectDB();

    // Fetch all current records
    const [events, users, registrations] = await Promise.all([
      Event.find({}),
      User.find({}),
      Registration.find({}),
    ]);

    const userIds = new Set(users.map((u) => u._id.toString()));
    const eventIds = new Set(events.map((e) => e._id.toString()));

    console.log(`Found ${users.length} Users, ${events.length} Events, and ${registrations.length} Registrations.\n`);

    // CHECK 1: Event.registeredCount equals active registrations count
    console.log('CHECK 1: Registered Count vs. Active Registrations Consistency');
    let check1Failed = false;

    // Group active registrations by event
    const activeRegsByEvent = {};
    for (const reg of registrations) {
      if (reg.status === 'registered') {
        const evtId = reg.event.toString();
        activeRegsByEvent[evtId] = (activeRegsByEvent[evtId] || 0) + 1;
      }
    }

    for (const evt of events) {
      const activeCount = activeRegsByEvent[evt._id.toString()] || 0;
      if (evt.registeredCount !== activeCount) {
        console.error(
          `  [FAIL] Event "${evt.title}" (_id: ${evt._id}) count mismatch! ` +
          `registeredCount is ${evt.registeredCount}, but active registrations are ${activeCount}`
        );
        check1Failed = true;
      }
    }

    if (!check1Failed) {
      console.log('  [PASS] All events have registeredCount matching active registrations.');
    } else {
      passedAll = false;
    }

    // CHECK 2: No orphan registrations
    console.log('\nCHECK 2: Orphan Registration Check (Missing User or Event)');
    let check2Failed = false;

    for (const reg of registrations) {
      const uId = reg.user ? reg.user.toString() : null;
      const eId = reg.event ? reg.event.toString() : null;

      if (!uId || !userIds.has(uId)) {
        console.error(`  [FAIL] Orphan Registration (_id: ${reg._id}): User ${uId} does not exist!`);
        check2Failed = true;
      }

      if (!eId || !eventIds.has(eId)) {
        console.error(`  [FAIL] Orphan Registration (_id: ${reg._id}): Event ${eId} does not exist!`);
        check2Failed = true;
      }
    }

    if (!check2Failed) {
      console.log('  [PASS] No orphan registrations detected (all users and events exist).');
    } else {
      passedAll = false;
    }

    // CHECK 3: No event exceeds capacity
    console.log('\nCHECK 3: Capacity Bounds Check (registeredCount <= capacity)');
    let check3Failed = false;

    for (const evt of events) {
      if (evt.registeredCount > evt.capacity) {
        console.error(
          `  [FAIL] Overbooked Event "${evt.title}" (_id: ${evt._id}): ` +
          `registeredCount (${evt.registeredCount}) exceeds capacity (${evt.capacity})!`
        );
        check3Failed = true;
      }
      if (evt.registeredCount < 0) {
        console.error(
          `  [FAIL] Negative registeredCount on Event "${evt.title}" (_id: ${evt._id})!`
        );
        check3Failed = true;
      }
    }

    if (!check3Failed) {
      console.log('  [PASS] All events are within valid capacity limits.');
    } else {
      passedAll = false;
    }

    // CHECK 4: Unique (user, event) constraint check
    console.log('\nCHECK 4: Duplicate Registration Constraint Check');
    const seenUserEventPairs = new Set();
    let check4Failed = false;

    for (const reg of registrations) {
      const key = `${reg.user.toString()}#${reg.event.toString()}`;
      if (seenUserEventPairs.has(key)) {
        console.error(
          `  [FAIL] Duplicate Registration found for user ${reg.user} and event ${reg.event}!`
        );
        check4Failed = true;
      }
      seenUserEventPairs.add(key);
    }

    if (!check4Failed) {
      console.log('  [PASS] All (user, event) compound pairs are unique.');
    } else {
      passedAll = false;
    }

    // CHECK 5: Virtuals check (isFull and seatsLeft)
    console.log('\nCHECK 5: Virtual Properties Accuracy Check');
    let check5Failed = false;

    for (const evt of events) {
      const expectedIsFull = evt.registeredCount >= evt.capacity;
      const expectedSeatsLeft = Math.max(0, evt.capacity - evt.registeredCount);

      if (evt.isFull !== expectedIsFull || evt.seatsLeft !== expectedSeatsLeft) {
        console.error(
          `  [FAIL] Virtual mismatch on "${evt.title}": isFull=${evt.isFull} (expected ${expectedIsFull}), seatsLeft=${evt.seatsLeft} (expected ${expectedSeatsLeft})`
        );
        check5Failed = true;
      }
    }

    if (!check5Failed) {
      console.log('  [PASS] All virtual properties (isFull, seatsLeft) calculate accurately.');
    } else {
      passedAll = false;
    }

    // Final Report
    console.log('\n======================================================');
    if (passedAll) {
      console.log('       ALL DATABASE INTEGRITY CHECKS PASSED [PASS]    ');
      console.log('======================================================\n');
      process.exit(0);
    } else {
      console.error('      ONE OR MORE INTEGRITY CHECKS FAILED [FAIL]      ');
      console.log('======================================================\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('Integrity check crashed with error:', error);
    process.exit(1);
  }
};

runIntegrityChecks();
