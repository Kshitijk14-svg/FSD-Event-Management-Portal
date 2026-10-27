const { Event, Registration } = require('../models');
const httpError = require('../utils/httpError');
const { searchEvents } = require('../utils/queries');

const FIELDS = ['title', 'description', 'category', 'date', 'venue', 'capacity', 'price', 'imageUrl'];

const pick = (body) =>
  FIELDS.reduce((acc, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});

// Loads the event and ensures the caller is its organizer or an admin.
const getOwnedEvent = async (req) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw httpError(404, 'Event not found');

  const isOwner = event.organizer.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw httpError(403, 'You do not have permission to do this');

  return event;
};

const SORTS = ['date', '-date', 'newest'];
const CATEGORIES = ['Tech', 'Music', 'Sports', 'Workshop', 'Cultural', 'Business', 'Other'];
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseDate = (value, name) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw httpError(400, `Invalid "${name}" date`);
  return d;
};

// GET /api/events — discovery; delegates the Mongo query to utils/queries.searchEvents.
const listEvents = async (req, res) => {
  const { q, category, from, to, sort, page, limit, past } = req.query;
  const now = new Date();

  // Query values can be objects (?category[$ne]=x); only accept plain known strings.
  if (category !== undefined && category !== 'All' && !CATEGORIES.includes(category)) {
    throw httpError(400, `Category must be one of: ${CATEGORIES.join(', ')}`);
  }
  if (sort && !SORTS.includes(sort)) throw httpError(400, `Sort must be one of: ${SORTS.join(', ')}`);

  let fromDate = from ? parseDate(from, 'from') : undefined;
  let toDate = to ? parseDate(to, 'to') : undefined;

  // Upcoming only by default; past=true flips it to events that already happened.
  if (past === 'true') {
    if (!toDate || toDate > now) toDate = now;
  } else if (!fromDate || fromDate < now) {
    fromDate = now;
  }

  const pageLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));

  const result = await searchEvents({
    q: typeof q === 'string' ? escapeRegex(q) : undefined,
    category,
    from: fromDate,
    to: toDate,
    sort,
    page,
    limit: pageLimit,
  });

  res.json({ success: true, data: result.events, page: result.page, pages: result.pages, total: result.total });
};

const createEvent = async (req, res) => {
  const event = await Event.create({ ...pick(req.body), organizer: req.user._id });
  res.status(201).json({ success: true, data: event, message: 'Event created' });
};

const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name');
  if (!event) throw httpError(404, 'Event not found');
  res.json({ success: true, data: event });
};

const getMyEvents = async (req, res) => {
  const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
  res.json({ success: true, data: events });
};

const updateEvent = async (req, res) => {
  const event = await getOwnedEvent(req);
  const updates = pick(req.body);

  if (updates.capacity !== undefined && updates.capacity < event.registeredCount) {
    throw httpError(400, `Capacity cannot be lower than current registrations (${event.registeredCount})`);
  }

  event.set(updates);
  await event.save();
  res.json({ success: true, data: event, message: 'Event updated' });
};

const deleteEvent = async (req, res) => {
  const event = await getOwnedEvent(req);

  await Registration.deleteMany({ event: event._id });
  await event.deleteOne();
  res.json({ success: true, data: null, message: 'Event deleted' });
};

module.exports = { listEvents, createEvent, getEvent, getMyEvents, updateEvent, deleteEvent, getOwnedEvent };
