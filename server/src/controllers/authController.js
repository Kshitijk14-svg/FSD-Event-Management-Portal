const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const httpError = require('../utils/httpError');

// Never expose the password hash.
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (await User.findOne({ email })) throw httpError(409, 'Email already registered');

  // Only attendee/organizer can be chosen publicly; admins are seeded or promoted.
  const user = await User.create({ name, email, password, role: role || 'attendee' });

  res.status(201).json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) throw httpError(401, 'Invalid email or password');

  res.json({ success: true, data: { user: publicUser(user), token: generateToken(user) } });
};

const me = async (req, res) => {
  res.json({ success: true, data: publicUser(req.user) });
};

module.exports = { register, login, me };
