'use strict';

const users = require('../users/users-model.js');

const bearerAuth = (req, res, next) => {

  if (!req.headers.authorization) {
    next('Invalid Login: Missing Headers');
    return;
  }

  let token = req.headers.authorization.split(' ').pop();

  users.authenticateToken(token)
    .then(validUser =>{
      req.user = validUser;
      next();
    })
    .catch(next('Invalid Login'));

};

module.exports = bearerAuth;

