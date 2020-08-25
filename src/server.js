'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

// error handlers
// const errorHandler = require('');
// const notFoundHandler = require('');

// app.use(errorHandler);
// app.use('*', notFoundHandler);

module.exports = {
  start: () => {
    app.listen(PORT, () =>
      console.log(`Server Listening On Port ${PORT}`)
    );
  }
};
