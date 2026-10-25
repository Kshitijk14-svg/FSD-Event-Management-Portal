const { User, Event, Registration } = require('../src/models');
const queries = require('../src/utils/queries');

console.log('--- Testing Kushagra Model Definitions & Logic ---');

// 1. Verify User validation
const invalidUser = new User({
  name: 'A',
  email: 'not-an-email',
  password: '123',
});
const userValidationErr = invalidUser.validateSync();
if (
  userValidationErr &&
  userValidationErr.errors['name'] &&
  userValidationErr.errors['email'] &&
  userValidationErr.errors['password']
) {
  console.log('✓ User validation successfully caught: short name, invalid email, short password.');
} else {
  console.error('✗ User validation failed:', userValidationErr);
}

// 2. Verify Event validation & virtuals
const sampleEvent = new Event({
  title: 'Test Masterclass Event',
  description: 'A deep dive into Mongoose modeling and architecture.',
  category: 'Tech',
  date: new Date(),
  venue: 'Main Auditorium',
  capacity: 3,
  price: 0,
  organizer: '507f1f77bcf86cd799439011',
  registeredCount: 3,
});

const eventValidationErr = sampleEvent.validateSync();
if (!eventValidationErr) {
  console.log('✓ Event validation passed for valid event document.');
} else {
  console.error('✗ Event validation error:', eventValidationErr);
}

// Verify virtuals
if (sampleEvent.isFull === true && sampleEvent.seatsLeft === 0) {
  console.log(`✓ Event virtuals verified: isFull=${sampleEvent.isFull}, seatsLeft=${sampleEvent.seatsLeft}`);
} else {
  console.error('✗ Event virtuals calculation failed:', sampleEvent.isFull, sampleEvent.seatsLeft);
}

// 3. Verify Registration compound index
const regIndexes = Registration.schema.indexes();
const hasCompoundUnique = regIndexes.some(
  ([fields, options]) => fields.user === 1 && fields.event === 1 && options && options.unique === true
);
if (hasCompoundUnique) {
  console.log('✓ Registration compound unique index on { user: 1, event: 1 } confirmed.');
} else {
  console.error('✗ Registration missing compound unique index:', regIndexes);
}

// 4. Verify query helpers export
const expectedFns = [
  'searchEvents',
  'getStats',
  'attendeesForEvent',
  'atomicIncrementSeats',
  'atomicDecrementSeats',
];
const missingFns = expectedFns.filter((fn) => typeof queries[fn] !== 'function');
if (missingFns.length === 0) {
  console.log('✓ All 5 query helpers successfully exported in server/src/utils/queries.js');
} else {
  console.error('✗ Missing query helpers:', missingFns);
}

console.log('--- All Model & Helper Unit Checks Completed ---');
