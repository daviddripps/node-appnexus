/*global require */

var buster = require('buster');
var Client = require('../lib/client');
var Campaign = require('../lib/campaign');

buster.testCase('AppNexus Campaign', {
  setUp: function() {
    this.stub(Client.prototype, 'authenticate').yields(null);

    this.client = new Client('test_user', 'test_pass');
  },
  'constructor': {
    'assigns the campaignId to this.id if provided': function() {
      var campaignId = 'asdfjkl';

      var campaign = new Campaign('asdfjkl', { /* fake AppNexus Client */ });

      assert.equals(campaign.id, campaignId);
    },
    'assigns the provided client to this.client': function() {
      var fakeClient = {
        name: 'fakeClient',
        dummyFn: function() {},
        number: 12345
      };

      var campaign = new Campaign(null, fakeClient);

      assert.same(campaign.client, fakeClient);
    },
    'throws if no client is provided': function() {
      assert.exception(function() {
        new Campaign('asdfjkl');
      });
    }
  },
  'getInfo()': {
    setUp: function() {
      this.requestBody = {
        campaign: {
          name: 'test_campaign'
        }
      };

      //stub this.client.request so it doesn't actually make the API requests
      this.stub(this.client, 'request').yields(null, this.requestBody);
    },
    'throws if no id is set for the Campaign': function() {
      var campaign = new Campaign(null, { /* fake AppNexus Client */ });

      assert.exception(function() {
        campaign.getInfo();
      });
    },
    'makes an API request with the campaign id': function() {
      var campaign = new Campaign(1234567, this.client);

      campaign.getInfo(function() {
        assert.calledOnce(this.client.request);

        //assert that the requested url is to the campaign endpoint with the campaign id appended
        assert.match(this.client.request.args[0][1], /.+\/campaign.+id=1234567.*/);
      }.bind(this));
    },
    'assigns the result of the API request to this.data': function() {
      var campaign = new Campaign('test_cam', this.client);

      //be sure this.data isn't already set
      refute.defined(campaign.data);

      campaign.getInfo(function() {
        assert.equals(campaign.data, this.requestBody.campaign);
      }.bind(this));
    },
    'returns this.data without making an API request if it has been populated': function() {
      var campaign = new Campaign('test_cam', this.client);
      campaign.data = this.requestBody.campaign;

      campaign.getInfo(function() {
        refute.called(this.client.request);
      }.bind(this));
    }
  }
});
