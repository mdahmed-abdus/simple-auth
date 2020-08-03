const { Router } = require('express');
const { guest } = require('../middleware/auth');

const router = Router();

router.get('/', guest, (req, res) => res.render('home'));

module.exports = router;
