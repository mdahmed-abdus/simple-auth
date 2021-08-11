const { Router } = require('express');
const { guest } = require('../middleware/auth');
const catchAsyncErr = require('../middleware/catchAsyncErr');

const router = Router();

router.get(
  '/',
  guest,
  catchAsyncErr((req, res) => res.render('home'))
);

module.exports = router;
