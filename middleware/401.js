'use strict';

module.exports = (error, req, res) => {
  res.status(401);
  res.statusMessage = 'Invalid Login, Unauthorized';
  res.json({error:error});
};
