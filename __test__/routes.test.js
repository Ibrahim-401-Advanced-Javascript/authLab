'use strict';

process.env.SECRET = 'muysecreto';

const jwt = require('jsonwebtoken');

const server = require('../src/server.js').server;
const supergoose = require('@code-fellows/supergoose');

// let users = {
//   admin: { username: 'admin', password: 'password', role: 'admin' },
//   editor: { username: 'editor', password: 'password', role: 'editor'  },
//   user: { username: 'user', password: 'password', role: 'user'  },
// }

const mockRequest = supergoose(server);

  describe(`users signup/in`, () => {

    it('can sign up', async () => {

      const userData = { username: 'admin', password: 'password', role: 'admin', email: 'admin@admin.com' };

      const results = await mockRequest.post('/signup').send(userData);

      const token = jwt.verify(results.text, process.env.SECRET);

      expect(token.id).toBeDefined();

    });

    it('can signin with basic', async () => {

      const userData = { username: 'joey', password: 'password', role: 'admin', email: 'admin@admin.com' };

      await mockRequest.post('/signup').send(userData);

      const results = await mockRequest.post('/signin').auth('joey', 'password');

      const token = jwt.verify(results.text, process.env.SECRET);

      expect(token).toBeDefined();

    });

  });
