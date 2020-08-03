const { Router } = require('express');
const bcrypt = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require('../config/bcrypt');
const { User } = require('../models/user');
const { registerSchema, loginSchema } = require('../validation/user');
const { guest, auth, active } = require('../middleware/auth');
const { login, logout } = require('../auth/auth');

const router = Router();

router.get('/profile', [auth, active], async (req, res) => {
  const user = await User.findById(req.session.userId);

  res.render('profile', { user });
});

router.get('/register', guest, (req, res) => res.render('register'));

router.post('/register', guest, async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .render('register', { message: error.details[0].message });

  const { name, email, password } = req.body;

  const found = await User.findOne({ email });
  if (found)
    return res
      .status(400)
      .render('register', { message: 'User already registered' });

  const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  login(req, res, user._id);
});

router.get('/login', guest, (req, res) => res.render('login'));

router.post('/login', guest, async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .render('login', { message: error.details[0].message });

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .render('login', { message: 'Invalid email or password' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch)
    return res
      .status(400)
      .render('login', { message: 'Invalid email or password' });

  login(req, res, user._id);
});

router.post('/logout', [auth, active], (req, res) => logout(req, res));

module.exports = router;
