'use strict';

const express = require('express');
const bearerAuth = require('../auth/auth-middleware/bearerAuth-middleware');
const permissions = require('../auth/auth-middleware/basicAuth-middleware.js');
const router = express.Router();

const routeHandler = (req, res) => {
  res.status(200).send('Access Granted');
};

router.get('/public', routeHandler);
router.get('/private', bearerAuth, routeHandler);
router.get('/readonly', bearerAuth, permissions('read'), routeHandler);
router.post('/create', bearerAuth, permissions('create'), routeHandler);
router.put('/update', bearerAuth, permissions('update'), routeHandler);
router.delete('./delete', bearerAuth, permissions('delete'), routeHandler);


module.exports = router;
