'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.CEO_SECRET;

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email:{ type: String },
  role: { type: String }, 
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

  let query = { username };
  const foundUser = await this.findOne(query);
  const match = foundUser && await foundUser.comparePassword(password);

  return match;

};

users.methods.comparePassword = async function(inputPass) {
  try {
    const passMatch = await bcrypt.compare(inputPass, this.password);
  
    return passMatch ? this : null;
  }
  catch (e) { next(`ERROR: ${e.message}`) };

};

users.statics.createFromOAuth = async function(username) {

  if (!username) { return Promise.reject('Validation Error') }

  const foundUser = await this.findOne({ username });

  try { 
    if (!foundUser) {
    throw new Error('User Not Found');
  } else if (foundUser) {
    return foundUser
    }
  
  } catch (e) {
    let createdUser = this.create({ username: email, password: 'none', email: email });

    return createdUser;
  }

};

users.methods.getToken = function() {

  let tokenData = {
    id: this._id,
    role: this.role,
  }

  let options = {};

  const signed = jwt.sign(tokenData, SECRET, options);

  return signed;

};

users.statics.authenticateToken = function(token) {

  let parsedToken = jwt.verify(token, SECRET);
  return this.findById(parsedToken.id);

}

module.exports = mongoose.model('users', users);
