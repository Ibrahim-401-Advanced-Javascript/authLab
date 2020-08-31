'use strict';

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const SINGLE_USE_TOKENS = false;
const TOKEN_EXPIRE = '60m';
const SECRET = process.env.CEO_SECRET;

const usedTokens = new Set();

const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String},
  email:{ type: String },
  role: { type: String }, 
  capabilities: { type: Array, required: true, default: [] },
});

//modify user instance before saving
users.pre('save', async function() {
  // if password is modified(being saved initially)
  // then hash it. else, nothing
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  let role = this.role;
  
  if(this.isModified('role')) {
    
    switch(role) {
      case 'admin':
        this.capabilities = ['create', 'read', 'update', 'delete'];
        break;
      case 'editor':
        this.capabilities = ['create', 'read', 'update'];
        break;
      case 'writer':
        this.capabilities = ['create', 'read'];
        break;
      case 'user':
        this.capabilities = ['read'];
        break;
      }
            
  }
          
});


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

users.statics.authenticateToken = function(token) {

  if(usedTokens.has(token)) {
    console.log('error error error');
    return Promise.reject('Invalid Token');
  }

  try {
    let parsedToken = jwt.verify(token, SECRET);

    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);

    let query = { _id: parsedToken.id };
    return this.findOne(query);
  } catch (e) {
    throw new Error('Invalid Token'); }

};

users.statics.authenticateBasic = function (username, password) {

  let query = { username };
  const foundUser = this.findOne(query);
  const match = foundUser && foundUser.comparePassword(password);

  return match;

};

users.methods.comparePassword = async function(inputPass) {
  try {
    const passMatch = await bcrypt.compare(inputPass, this.password);
  
    return passMatch ? this : null;
  }
  catch (e) { next(`ERROR: ${e.message}`) };

};


users.methods.getToken = function() {

  let tokenData = {
    id: this._id,
    role: this.role,
    capabilities: this.capabilities,
  };

  let options = {};
  if (type !== 'key' && !!TOKEN_EXPIRE) {
    options = { expiresIn: TOKEN_EXPIRE };
  }

  const signed = jwt.sign(tokenData, SECRET, options);
  return signed;

};

users.methods.getKey = function () {
  return this.generateToken('key');
}


module.exports = mongoose.model('users', users);
