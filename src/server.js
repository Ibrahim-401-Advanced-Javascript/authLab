'use strict';

const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

// app level middleware
app.use(express.static('./public'));
app.use(express.json());

// error handlers
const handle500 = require('../middleware/500.js');
const handle404 = require('../middleware/404.js');
const handle401 = require('../middleware/401.js');
const handle403 = require('../middleware/403.js');

app.use(handle500);
app.use('*', handle404);
app.use(handle401);
app.use(handle403);

const users = require('../src/auth/users/users-model.js');
const basicAuth = require('./auth/auth-middleware/basicAuth-middleware.js');
const authorize = require('../src/auth/auth-middleware/oAuth-middleware.js');
const bearerAuth = require('../src/auth/auth-middleware/bearerAuth-middleware');

// ------------
//custom route callbacks

//http post :3000/signup
const signUpHandler = (req, res) => {
  users.save(req.body);
  try { (user => {
    let token = users.getToken(user);
    res.status(200).send(token);
  });

  } catch (e) { (`ERROR: ${e.message}`); }

  // .then(user => {
  //   let token = users.getToken(user);
  //   res.status(200).send(token);
  // })
  // .catch(handle403);
    
};

//http post :3000/signin -a user:pass
const signInHandler = (req, res) => {
  res.status(200).send(req.token);
};

const oAuthHandler = (req, res) => {
  res.status(200).send(req.token);
};

// http get :3000/users
const listUsers = (req, res) => {
  res.status(200).json(users.list());
};

// const bearerAuthHandler = (req, res) => {

// };

// ------------

// routes
app.post('/signup', signUpHandler);
app.post('/signin', basicAuth, signInHandler);
app.get('/oauth', authorize, oAuthHandler);
// app.get('/bearer', bearerAuth, bearerAuthHandler);
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
