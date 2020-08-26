'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handle401 = require('../../../middleware/401.js');

let db = {};

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:{ type: String },
  role: { type: String, required: true }, 
});

//modify user instance before saving
users.pre('save', async function() {
  // if password is modified(being saved initially)
  // then hash it. else, nothing
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

users.statics.authenticateBasic = async function (username, password) {

  let query = {username};
  const foundUser = await this.findOne(query);
  const match = foundUser && await foundUser.comparePassword(password);

  return match;

};

users.methods.comparePassword = async function(inputPass) {
  try {
    const passMatch = await bcrypt.compare(inputPass, this.password);
  
    return passMatch ? this : null;
  }
  catch{ (handle401) };

};

users.methods.getToken = function () {

  let tokenData = {
    id: this._id,
    role: this.role,
  }

  const signed = jwt.sign(tokenData, process.env.CEO_SECRET);

  return signed;

};

users.list = () => db;

module.exports = mongoose.model('users', users);
