'use strict';

require('dotenv').config();

const mongoose = require('mongoose');

const mongooseOpts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB_URI, mongooseOpts);

console.log(process.env.MONGODB_URI);

require('./src/server.js').start(process.env.PORT);
