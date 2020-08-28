'use strict';

const users = require('../users/users-model.js');

const bearerAuth = (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  users.authenticateToken(token);
  try {
    (validUser =>{
      req.user = validUser;
      next();
    });
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }

};

module.exports = bearerAuth;

