const { User, Event, Registration } = require('../models');
const httpError = require('../utils/httpError');
const { getStats } = require('../utils/queries');

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt });

const stats = async (req, res) => {
  res.json({ success: true, data: await getStats() });
};

const listUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users.map(publicUser) });
};

const updateUserRole = async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw httpError(400, 'You cannot change your own role');

  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');

  user.role = req.body.role;
  await user.save();
  res.json({ success: true, data: publicUser(user), message: 'Role updated' });
};

const deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) throw httpError(400, 'You cannot delete your own account');

  const user = await User.findById(req.params.id);
  if (!user) throw httpError(404, 'User not found');

  // Free the seats this user was holding on other events.
  const held = await Registration.find({ user: user._id, status: 'registered' }).select('event');
  if (held.length) {
    await Event.updateMany({ _id: { $in: held.map((r) => r.event) }, registeredCount: { $gt: 0 } }, { $inc: { registeredCount: -1 } });
  }
  await Registration.deleteMany({ user: user._id });

  // Remove the events they organized, along with those events' registrations.
  const owned = await Event.find({ organizer: user._id }).select('_id');
  if (owned.length) {
    await Registration.deleteMany({ event: { $in: owned.map((e) => e._id) } });
    await Event.deleteMany({ organizer: user._id });
  }

  await user.deleteOne();
  res.json({ success: true, data: null, message: 'User deleted' });
};

module.exports = { stats, listUsers, updateUserRole, deleteUser };
