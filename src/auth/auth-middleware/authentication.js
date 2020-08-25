'use strict';

const base64 = require('base-64');

const users = require('../users/users-model.js');
const handle401 = require('../../../middleware/401.js');

const createAuth = (req, res, next) => {
  if(!req.headers.authorization) {
    next('Invalid Login');
    return;
  }

  // extracts encoded bit by
  // splitting the header into an array
  // and popping the second element off
  let encodedPair = req.headers.authorization.split(' ').pop();
  console.log('encoded pair: ', encodedPair);

  // decodes to user:pass
  // splits it to an array
  let decoded = base64.decode(encodedPair);
  let [user, pass] = decoded.split(':');
  console.log('decoded: ', decoded);

  // authenticates the user
  users.authenticate(user, pass)
    .then(validUser => {
      req.token = users.getToken(validUser);
      next();
    })
    .catch(handle401);

};

module.exports = createAuth;

