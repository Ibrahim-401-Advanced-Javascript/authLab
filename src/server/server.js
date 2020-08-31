'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

// app level middleware
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors);

// error handlers
const e500 = require('../../middleware/500.js');
const e404 = require('../../middleware/404.js');
const e401 = require('../../middleware/401.js');
const e403 = require('../../middleware/403.js');
app.use(e500);
app.use(e404);
app.use(e401);
app.use(e403);

// routing middleware
const authRouter = require('./router.js');
const extraRouter = require('./extra-routes.js');
app.use(authRouter);
app.use(extraRouter);

const basicAuth = require('../auth/auth-middleware/basicAuth-middleware.js');
const bearerAuth = require('../auth/auth-middleware/bearerAuth-middleware');

const users = require('../auth/users/users-model.js');

// ------------
//custom route callbacks

// http get :3000/users
const listUsers = (req, res) => {
  res.status(200).json(users.list());
};

// ------------

// routes
app.get('/bearer', bearerAuth, bearerAuth);
app.get('/users', basicAuth, listUsers);


// ------------
// start server
module.exports = {
  start: () => {
    app.listen(PORT, () =>
      console.log(`Server Listening On Port ${PORT}`)
    );
  }
};
