const express = require('express');
const { body } = require('express-validator');

const {
  listEvents,
  createEvent,
  getEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const {
  registerForEvent,
  cancelRegistration,
  eventAttendees,
} = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const CATEGORIES = ['Tech', 'Music', 'Sports', 'Workshop', 'Cultural', 'Business', 'Other'];

// On create every required field must be present; on update they are all optional.
const eventRules = (required) => {
  const field = (name) => (required ? body(name) : body(name).optional());
  return [
    field('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
    field('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required (max 2000 characters)'),
    field('category').isIn(CATEGORIES).withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
    field('date')
      .isISO8601().withMessage('Date must be a valid date/time')
      .bail()
      .custom((v) => new Date(v) > new Date()).withMessage('Date must be in the future'),
    field('venue').trim().notEmpty().withMessage('Venue is required'),
    field('capacity').isInt({ min: 1 }).withMessage('Capacity must be an integer of at least 1').toInt(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be 0 or more').toFloat(),
    body('imageUrl')
      .optional({ values: 'falsy' })
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Image URL must be a valid http or https URL'),
  ];
};

// Declared before '/:id' so "mine" is not treated as an id.
router.get('/mine', protect, authorize('organizer', 'admin'), getMyEvents);

router.get('/', listEvents);
router.post('/', protect, authorize('organizer', 'admin'), eventRules(true), validate, createEvent);
router.get('/:id', getEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), eventRules(false), validate, updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, cancelRegistration);
router.get('/:id/attendees', protect, authorize('organizer', 'admin'), eventAttendees);

module.exports = router;
