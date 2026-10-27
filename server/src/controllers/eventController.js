const { Event, Registration } = require('../models');
const httpError = require('../utils/httpError');

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

module.exports = { createEvent, getEvent, getMyEvents, updateEvent, deleteEvent, getOwnedEvent };
