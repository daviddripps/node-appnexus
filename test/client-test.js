/*global require */

var buster = require('buster');
var Client = require('../lib/client');

buster.testCase('AppNexus Client', {
  'constructor': {
    setUp: function() {
      //stub the authenticate method since we don't actually want to make the API request
      var testToken = this.testToken = '123456789abcdefghijklmonp';

      this.stub(Client.prototype, 'authenticate').yields(null, testToken);

      this.client = new Client('test_username', 'test_password');
    },
    'stores the username and password provided': function() {
      assert.equals(this.client.username, 'test_username');
      assert.equals(this.client.password, 'test_password');
    },
    '//throws if a username or password are not supplied': function() {
      //TODO
    },
    '//merges the provided options over the default options': function() {
      //TODO: create a new Client with no options and store client.options
      //TODO: create a new Client with custom options and compare to the stored options
    }
  },
  'authenticate()': {
    setUp: function() {
      this.client = new Client('test_username', 'test_password');

      //@see https://wiki.appnexus.com/display/api/Authentication+Service - Step 2
      var responseBody = {
        "response": {
          "status": "OK",
          "token": "h20hbtptiv3vlp1rkm3ve1qig0",
          "dbg_info": {
            "instance": "13.hbapi.prod.nym1",
            "slave_hit": false,
            "db": "master",
            "time": 165.15779495239,
            "start_microtime": 1332339041.1044,
            "version": "1.11.20"
          }
        }
      };

      this.stub(this.client, 'request').yields(null, null, responseBody);
    },
    'returns a session token from the response body': function() {
      this.client.authenticate(function(err, token) {
        assert.equals(token, 'h20hbtptiv3vlp1rkm3ve1qig0');
      });
    },
    'assigns the session token to client.token': function() {
      this.client.authenticate(function(err, token) {
        assert.equals(this.client.token, token);
      }.bind(this));
    }
  }
});