require('dotenv').config({ path: './config' });
const { APP_PORT } = require('./config/app');
const express = require('express');

const app = express();

require('./startup/connectDb')(app);

app.on('ready', () => {
  require('./startup/routes')(app);

  app.listen(APP_PORT, () =>
    console.log(`Server running on port: ${APP_PORT}`)
  );
});
