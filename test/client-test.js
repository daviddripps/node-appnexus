/*global require */

var buster = require('buster');
var Client = require('../lib/client');

buster.testCase('AppNexus Client', {
  'constructor': {
    'stores the username and password provided': function() {
      //stub the authenticate() method so we don't actually make the request
      Client.prototype.authenticate = this.spy();

      var client = new Client('test_username', 'test_password');

      assert.equals(client.username, 'test_username');
      assert.equals(client.password, 'test_password');
    },
    '//throws if a username or password are not supplied': function() {

    },
    '//merges the provided options over the default options': function() {
      //TODO: create a new Client with no options and store client.options
      //TODO: create a new Client with custom options and compare to the stored options
    },
    '//authenticates the user': function() {
      //TODO: stub the Client.authenticate() method
      //TODO: call the constructor
      //TODO: assert that authenticate() was called
    }
  },
  'authenticate()': {

  }
});