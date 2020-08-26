'use strict';

require('dotenv').config();
require('@code-fellows/supergoose');
const jwt = require('jsonwebtoken');
const User = require('../src/auth/users/users-model.js');

afterEach(async () => {
  await User.deleteMany({});
});

const fakeUser = {
  username: 'janedoe',
  password: 'password',
  role: 'admin',
  email: 'jane@doe.com',
}

it('should save a hashed password', async () => {
  const user = await new User(fakeUser).save();
  expect(user.username).toBe(fakeUser.username);
  expect(user.password).not.toBe(fakeUser.password);
});

it('should authenticate a known user', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = User.authenticateBasic(fakeUser.username, fakeUser.password);
  expect(authenticatedUser).toBeDefined();
});

it('should return null for unknown user when none', async () => {
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBe(null);
});

it('should return null for unknown user when there are others', async () => {
  await new User(fakeUser).save();
  const authenticatedUser = await User.authenticateBasic('nobody', 'unknown');
  expect(authenticatedUser).toBe(null);
});

it('should return null when password is bad', async () => {
  const user = await new User(fakeUser).save();
  const comparison = await user.comparePassword('wrongpass');
  expect(comparison).toBe(null);
});

it('should generate a token', async() => {
  const user = await new User(fakeUser).save();
  const token = user.getToken();
  expect(token).toBeDefined();
  const verifiedToken = jwt.verify(token, process.env.CEO_SECRET);
  expect(verifiedToken.role).toBe(user.role);
})