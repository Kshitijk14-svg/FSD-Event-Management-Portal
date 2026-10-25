const jwt = require('jsonwebtoken');

const User = require('../models/User');
const httpError = require('../utils/httpError');

// Verifies the Bearer token and attaches the user to req.user.
const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw httpError(401, 'Not authenticated');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw httpError(401, 'Invalid or expired token');
  }

  const user = await User.findById(payload.id);
  if (!user) throw httpError(401, 'User no longer exists');

  req.user = user;
  next();
};

// Use after protect: authorize('organizer', 'admin')
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw httpError(403, 'You do not have permission to do this');
  next();
};

module.exports = { protect, authorize };
