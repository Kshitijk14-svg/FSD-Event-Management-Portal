const { Event, Registration } = require('../models');
const httpError = require('../utils/httpError');
const { attendeesForEvent, atomicIncrementSeats, atomicDecrementSeats } = require('../utils/queries');
const { getOwnedEvent } = require('./eventController');

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) throw httpError(404, 'Event not found');

  if (event.date <= new Date()) throw httpError(400, 'This event has already started or ended');
  if (event.organizer.toString() === req.user._id.toString()) {
    throw httpError(403, 'You cannot register for your own event');
  }

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing && existing.status === 'registered') throw httpError(409, 'You are already registered for this event');

  // Take the seat first (atomic, so capacity can never be exceeded), then record the registration.
  const updatedEvent = await atomicIncrementSeats(event._id);
  if (!updatedEvent) throw httpError(409, 'Event is full');

  let registration;
  try {
    if (existing) {
      existing.status = 'registered';
      registration = await existing.save();
    } else {
      registration = await Registration.create({ user: req.user._id, event: event._id });
    }
  } catch (err) {
    await atomicDecrementSeats(event._id); // give the seat back
    throw err;
  }

  res.status(201).json({
    success: true,
    data: { registration, event: updatedEvent },
    message: 'Registered successfully',
  });
};

const cancelRegistration = async (req, res) => {
  // Single atomic status flip, so a double-click can't decrement the count twice.
  const registration = await Registration.findOneAndUpdate(
    { user: req.user._id, event: req.params.id, status: 'registered' },
    { status: 'cancelled' },
    { new: true }
  );
  if (!registration) throw httpError(404, 'You are not registered for this event');

  const event = await atomicDecrementSeats(registration.event);
  res.json({ success: true, data: { registration, event }, message: 'Registration cancelled' });
};

const myRegistrations = async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id, status: 'registered' }).populate('event');

  const data = registrations
    .filter((r) => r.event) // skip registrations whose event no longer exists
    .sort((a, b) => a.event.date - b.event.date);

  res.json({ success: true, data });
};

const eventAttendees = async (req, res) => {
  const event = await getOwnedEvent(req);
  const attendees = await attendeesForEvent(event._id);

  const data = attendees
    .filter((a) => a.user)
    .map((a) => ({ id: a.user._id, name: a.user.name, email: a.user.email, registeredAt: a.registeredAt }));

  res.json({ success: true, data });
};

module.exports = { registerForEvent, cancelRegistration, myRegistrations, eventAttendees };
