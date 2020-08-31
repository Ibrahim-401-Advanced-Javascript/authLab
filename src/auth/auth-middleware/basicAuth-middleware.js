'use strict';

const base64 = require('base-64');

const users = require('../users/users-model.js');

const basicAuth = async (req, res, next) => {

  const errorObj = { status: 401, statusMessage: 'Unauthorized', message: 'Invalid Login' };

  if(!req.headers.authorization) {
    next(errorObj);
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
  try {
    const validUser = await users.authenticate(user, pass);

    req.token = validUser.getToken();
    next();
  } catch (e) { next(errorObj) };

  return validUser;

};

module.exports = basicAuth;

