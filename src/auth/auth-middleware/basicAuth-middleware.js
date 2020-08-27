'use strict';

const base64 = require('base-64');

const users = require('../users/users-model.js');
const handle401 = require('../../../middleware/401.js');

const basicAuth = async (req, res, next) => {

  if(!req.headers.authorization) {
    next(handle401);
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
  } catch {
      next(handle401);
  }

    // .then(validUser => {
    //   req.token = users.getToken(validUser);
    //   next();
    // })
    // .catch(next(handle401));

    return validUser;
};

module.exports = basicAuth;

