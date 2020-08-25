'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SECRET = process.env.SECRET;

let db = {};

let users = {};

users.save = async function (record) {

  if (!db[record.username]) {
    // hash the password and save it to the user
    record.password = await bcrypt.hash(record.password, 5)
    //create a new user
    db[record.username] = record;

    return record;
  }

  return Promise.reject();

}

users.authenticate = async function (user) {
  let valid = await bcrypt.compare(pass, db[user].password);
  if (valid) {
    return db[user];
  }

  return Promise.reject();
}

users.getToken = function (user) {
  let token = jwt.sign({username: user.username}, SECRET)
  return token;
}

users.list = () => db;

module.exports = users;
