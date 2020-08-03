const { SESSION_ABSOLUTE_TIMEOUT } = require('../config/session');
const { logout, isLoggedIn } = require('../auth/auth');

const guest = async (req, res, next) => {
  if (isLoggedIn(req)) return res.redirect('/users/profile');

  next();
};

const auth = async (req, res, next) => {
  if (!isLoggedIn(req)) return res.redirect('/users/login');

  next();
};

const active = async (req, res, next) => {
  const now = Date.now();
  const { createdAt } = req.session;

  if (now > createdAt + SESSION_ABSOLUTE_TIMEOUT) return logout(req, res);

  next();
};

module.exports = { guest, auth, active };
