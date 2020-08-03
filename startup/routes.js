const { json, urlencoded } = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { SESSION_OPTIONS } = require('../config/session');
const { STORE_OPTIONS } = require('../config/store');
const home = require('../routes/home');
const users = require('../routes/users');
const error = require('../middleware/error');

module.exports = (app) => {
  // middleware
  app.use(helmet());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(
    session({ ...SESSION_OPTIONS, store: new MongoStore(STORE_OPTIONS) })
  );
  app.use(mongoSanitize());
  app.use(xss());

  // view engine
  app.set('views', './views');
  app.set('view engine', 'ejs');

  // routes
  app.use('/', home);
  app.use('/users', users);

  // 404 page
  app.use((req, res) => res.status(404).render('404'));

  // error middleware
  app.use(error);
};
