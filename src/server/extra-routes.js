'use strict';

const express = require('express');
const bearerAuth = require('../auth/auth-middleware/bearerAuth-middleware');
const router = express.Router();

router.get('/secret', bearerAuth, (req, res) => {
  res.status(200).send('Access Granted');
});

module.exports = router;
