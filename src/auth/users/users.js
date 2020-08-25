'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// users schema
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//modify user instance before saving
users.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticate = async function (username, password) {

  let query = {username};
  const foundUser = await this.findOne(query);
  const match = foundUser && await foundUser.comparePassword(password);

  return match;

};

users.methods.comparePassword = function(inputPass) {

  return bcrypt.compare(inputPass, this.password)
    .then(valid => {
      if (valid) {
        return this;
      } else {
        return null;
      }
    })

};

users.methods.getToken = function () {

  let tokenData = {
    id: this._id,
  }

  const signed = jwt.sign(tokenData, process.env.SECRET);

};

module.exports = mongoose.model('users', users);
