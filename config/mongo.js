const { MONGO_URI = 'mongodb://localhost:27017/simple-session-auth' } =
  process.env;

const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

module.exports = { MONGO_URI, MONGO_OPTIONS };
