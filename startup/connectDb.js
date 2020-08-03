const { connect } = require('mongoose');
const { MONGO_URI, MONGO_OPTIONS } = require('../config/mongo');

module.exports = async (app) => {
  try {
    const conn = await connect(MONGO_URI, MONGO_OPTIONS);

    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    app.emit('ready');
  } catch (err) {
    console.log('Could not connect to MongoDB');
    console.log(err);

    process.exit(1);
  }
};
