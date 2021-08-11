const { Router } = require('express');
const { hash, compare } = require('bcrypt');
const { BCRYPT_WORK_FACTOR, DUMMY_HASH } = require('../config/bcrypt');
const { User } = require('../models/user');
const { registerSchema, loginSchema } = require('../validation/user');
const { guest, auth, active } = require('../middleware/auth');
const catchAsyncErr = require('../middleware/catchAsyncErr');
const { login, logout } = require('../auth/auth');

const router = Router();

router.get(
  '/profile',
  [auth, active],
  catchAsyncErr(async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('profile', { user });
  })
);

router.get(
  '/register',
  guest,
  catchAsyncErr((req, res) => res.render('register'))
);

router.post(
  '/register',
  guest,
  catchAsyncErr(async (req, res) => {
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

    const hashedPassword = await hash(password, BCRYPT_WORK_FACTOR);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    login(req, res, user._id);
  })
);

router.get(
  '/login',
  guest,
  catchAsyncErr((req, res) => res.render('login'))
);

router.post(
  '/login',
  guest,
  catchAsyncErr(async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .render('login', { message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const passwordMatch = await compare(password, user?.password || DUMMY_HASH);
    if (!passwordMatch)
      return res
        .status(400)
        .render('login', { message: 'Invalid email or password' });

    login(req, res, user._id);
  })
);

router.post(
  '/logout',
  [auth, active],
  catchAsyncErr((req, res) => logout(req, res))
);

module.exports = router;
