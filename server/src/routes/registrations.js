const express = require('express');

const { myRegistrations } = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/mine', protect, myRegistrations);

module.exports = router;
