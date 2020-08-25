'use strict';

module.exports = (req,res) => {
  res.status(404);
  res.statusMessage = 'Resource Not Found';
  res.json({error:'Resource Not Found'});
};
