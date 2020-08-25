'use strict';

module.exports = (error, req, res) => {
  res.status(403);
  res.statusMessage = 'Error Creating User';
  res.json({error:error});
};
