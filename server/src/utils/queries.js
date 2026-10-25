const { User, Event, Registration } = require('../models');

/**
 * Build filter, sort, and pagination to search events
 * @param {Object} filters
 * @param {string} [filters.q] - Keyword search on title, description, venue
 * @param {string} [filters.category] - Filter by category
 * @param {string|Date} [filters.from] - Start date
 * @param {string|Date} [filters.to] - End date
 * @param {string} [filters.sort] - 'date', '-date', 'newest'
 * @param {number} [filters.page=1] - Page number
 * @param {number} [filters.limit=10] - Items per page
 * @returns {Promise<{ events: Array, total: number, pages: number, page: number }>}
 */
const searchEvents = async (filters = {}) => {
  const {
    q,
    category,
    from,
    to,
    sort = 'date',
    page = 1,
    limit = 10,
  } = filters;

  const query = {};

  // Text / keyword search
  if (q && q.trim() !== '') {
    const trimmed = q.trim();
    query.$or = [
      { title: { $regex: trimmed, $options: 'i' } },
      { description: { $regex: trimmed, $options: 'i' } },
      { venue: { $regex: trimmed, $options: 'i' } },
    ];
  }

  // Category filter
  if (category && category !== 'All') {
    query.category = category;
  }

  // Date range filters
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  // Sort mappings
  let sortOption = { date: 1 };
  if (sort === '-date') {
    sortOption = { date: -1 };
  } else if (sort === 'newest') {
    sortOption = { createdAt: -1 };
  } else if (sort === 'date') {
    sortOption = { date: 1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.max(1, parseInt(limit, 10) || 10);
  const skip = (pageNum - 1) * pageLimit;

  const total = await Event.countDocuments(query);
  const pages = Math.ceil(total / pageLimit) || 1;

  const events = await Event.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(pageLimit)
    .populate('organizer', 'name email');

  return {
    events,
    total,
    pages,
    page: pageNum,
  };
};

/**
 * Get platform-wide overview statistics using countDocuments
 * @returns {Promise<{ users: number, events: number, registrations: number }>}
 */
const getStats = async () => {
  const [users, events, registrations] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
    Registration.countDocuments({ status: 'registered' }),
  ]);

  return {
    users,
    events,
    registrations,
  };
};

/**
 * Retrieve all registered attendees for a specific event with populated user data
 * @param {string|mongoose.Types.ObjectId} eventId
 * @returns {Promise<Array>}
 */
const attendeesForEvent = async (eventId) => {
  const registrations = await Registration.find({
    event: eventId,
    status: 'registered',
  })
    .populate('user', 'name email role createdAt')
    .sort({ createdAt: -1 });

  return registrations.map((reg) => ({
    registrationId: reg._id,
    registeredAt: reg.createdAt,
    status: reg.status,
    user: reg.user,
  }));
};

/**
 * Atomic seat increment query to guarantee no overbooking under concurrent requests:
 * Only increments registeredCount if current registeredCount is less than capacity.
 *
 * @param {string|mongoose.Types.ObjectId} eventId
 * @returns {Promise<Event|null>} Updated event or null if full / not found
 *
 * Usage snippet for Kshitij:
 * const updatedEvent = await Event.findOneAndUpdate(
 *   { _id: eventId, $expr: { $lt: ['$registeredCount', '$capacity'] } },
 *   { $inc: { registeredCount: 1 } },
 *   { new: true, runValidators: true }
 * );
 * if (!updatedEvent) throw new Error('Event is already full');
 */
const atomicIncrementSeats = async (eventId) => {
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      $expr: { $lt: ['$registeredCount', '$capacity'] },
    },
    {
      $inc: { registeredCount: 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedEvent;
};

/**
 * Atomic seat decrement query when registration is cancelled:
 * Only decrements registeredCount if it is currently greater than 0.
 *
 * @param {string|mongoose.Types.ObjectId} eventId
 * @returns {Promise<Event|null>}
 */
const atomicDecrementSeats = async (eventId) => {
  const updatedEvent = await Event.findOneAndUpdate(
    {
      _id: eventId,
      registeredCount: { $gt: 0 },
    },
    {
      $inc: { registeredCount: -1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedEvent;
};

/**
 * Populate verification helper:
 * Verifies Registration.event, Registration.user, and Event.organizer
 * @param {string|mongoose.Types.ObjectId} registrationId
 * @returns {Promise<Object>}
 */
const verifyPopulatePaths = async (registrationId) => {
  const registration = await Registration.findById(registrationId)
    .populate('user', 'name email role')
    .populate({
      path: 'event',
      populate: {
        path: 'organizer',
        select: 'name email',
      },
    });

  return registration;
};

module.exports = {
  searchEvents,
  getStats,
  attendeesForEvent,
  atomicIncrementSeats,
  atomicDecrementSeats,
  verifyPopulatePaths,
};
