const { SESSION_NAME } = require('../config/session');

const isLoggedIn = req => !!req.session.userId;

const login = (req, res, userId) => {
  req.session.userId = userId;
  req.session.createdAt = Date.now();

  res.redirect('/users/profile/');
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.redirect('/users/profile');

    res.clearCookie(SESSION_NAME);

    res.redirect('/');
  });
};

module.exports = { isLoggedIn, login, logout };
