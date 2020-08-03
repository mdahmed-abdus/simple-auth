const { connection } = require('mongoose');

const STORE_OPTIONS = {
  mongooseConnection: connection,
  collection: 'sessions',
};

module.exports = { STORE_OPTIONS };
