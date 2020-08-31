'use strict';

const express = require('express');
const bearerAuth = require('../auth/auth-middleware/bearerAuth-middleware');
const permissions = require('../auth/auth-middleware/basicAuth-middleware.js');
const router = express.Router();

const routeHandler = (req, res) => {
  res.status(200).send('Access Granted');
};

router.get('/public', routeHandler);
// router.get('/private', bearerAuth, routeHandler);
// router.get('/readonly', bearerAuth, permissions('read'), routeHandler);


module.exports = router;
