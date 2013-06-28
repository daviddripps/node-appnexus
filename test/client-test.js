/*global require */

var buster = require('buster');
var Client = require('../lib/client');
var Campaign = require('../lib/campaign');
var extend = require('extend');

buster.testCase('AppNexus Client', {
  'constructor': {
    setUp: function () {
      //stub the authenticate method since we don't actually want to make the API request
      this.stub(Client.prototype, 'authenticate').yields(null);
    },
    'stores the username and password provided': function() {
      var client = new Client('test_username', 'test_password');

      assert.equals(client.username, 'test_username');
      assert.equals(client.password, 'test_password');
    },
    'throws if a username or password are not supplied': function() {
      assert.exception(function() { new Client() });
      assert.exception(function() { new Client(null, 'password') });
      assert.exception(function() { new Client('username') });
    },
    'merges the provided options over the default options': function() {

      var defaultOptsClient = new Client('user', 'pass');

      var customOptions = {
        url: 'http://www.google.com',
        dummyKey: 'dummy_data'
      };

      //create a new Client with custom options and compare to the stored options
      var customOptsClient = new Client('user', 'pass', customOptions);

      assert.equals(customOptsClient.options, extend(defaultOptsClient.options, customOptions));
    }
  },
  'authenticate()': {
    setUp: function() {
      this.client = new Client('test_username', 'test_password');

      //@see https://wiki.appnexus.com/display/api/Authentication+Service - Step 2
      this.responseBody = {
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
      };

      this.stub(this.client, 'request').yields(null, this.responseBody);

      this.client.authTime = false;
      this.client.authRequestSent = false;
      this.client.authListeners = [];
    },
    'adds the callback parameter to the client.authListeners': function() {
      assert.equals(this.client.authListeners.length, 0);

      //make the callback a function expression so we can compare it within the callback itself
      var callback = function() {
        assert.equals(this.client.authListeners[0], callback);
      }.bind(this);

      this.client.authenticate(callback);
    },
    'sets the authTime & assigns the session token to client.token': function() {
      this.client.authenticate(function() {
        //check authTime
        assert.less(Date.now() - this.client.authTime, 100);
        //check token
        assert.equals(this.client.token, this.responseBody.token);
      }.bind(this));
    },
    'only executes the auth request once concurrently': function() {
      //call authenticate twice
      this.client.authenticate(function() {});
      this.client.authenticate(function() {});

      //make sure this.client.request was only called once
      assert.calledOnce(this.client.request);
    },
    'if we are already authenticated, it returns without executing the auth request': function() {
      this.client.token = 'test_token';
      this.client.authTime = Date.now();

      this.client.authenticate(function() {});

      refute.called(this.client.request);
    }
  },
  'getCampaign()': {
    setUp: function() {
      this.client = new Client('test_username', 'test_password');

      //stub the authenticate method since we don't actually want to make the API request
      this.stub(this.client, 'authenticate').yields(null);
    },
    'calls authenticate()': function() {
      this.client.getCampaign('fakeCampaignId', function() {
        assert.calledOnce(this.client.authenticate);
      }.bind(this));
    },
    'returns a Campaign object with an ID matching the one provided': function() {
      var campaignId = 'fakeCampaignId';

      this.client.getCampaign(campaignId, function(err, campaign) {
        assert(campaign instanceof Campaign);
        assert.same(campaign.id, campaignId);
      }.bind(this));
    }
  }
});