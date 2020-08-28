'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('../auth/users/users-model.js');
const oAuth = require('../auth/auth-middleware/oAuth-middleware.js');
const basicAuth = require('../auth/auth-middleware/basicAuth-middleware.js');


const handleSignUp = async (req, res, next) => {
  try { const user = await User.create(req.body);
  const token = user.getToken();

  const responseBody = {
    token,
    user,
  };

  res.send(responseBody);
  } catch (e) { 
    (`ERROR: ${e.message}`);
  }
}

const handleSignIn = (req, res, next) => {
  res.cookie('auth', req.token);
  res.set('token', req.token);

  res.send( {
    token: req.token,
    user: req.user,
  } );
}

const handleOAuth = (req, res, next) => {
  res.status(200).send(req.token);
}

authRouter.post('/signup', handleSignUp);
authRouter.post('/signin', basicAuth, handleSignIn);
authRouter.get('/oauth', oAuth, handleOAuth);

module.exports = authRouter;