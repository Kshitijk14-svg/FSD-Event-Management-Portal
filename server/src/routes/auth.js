const express = require('express');
const { body } = require('express-validator');

const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 60 }).withMessage('Name must be 2-60 characters'),
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['attendee', 'organizer']).withMessage('Role must be attendee or organizer'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, me);

module.exports = router;
