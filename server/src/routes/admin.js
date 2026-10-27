const express = require('express');
const { body } = require('express-validator');

const { stats, listUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Every admin route requires a logged-in admin.
router.use(protect, authorize('admin'));

router.get('/stats', stats);
router.get('/users', listUsers);
router.patch(
  '/users/:id/role',
  [body('role').isIn(['attendee', 'organizer', 'admin']).withMessage('Role must be attendee, organizer or admin')],
  validate,
  updateUserRole
);
router.delete('/users/:id', deleteUser);

module.exports = router;
