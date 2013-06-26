/*global require */

var buster = require('buster');
var appnexus = require('../lib/appnexus');
var client = require('../lib/client');

buster.testCase('AppNexus Module', {
  'exposes the Client object via the Client key': function() {
    assert.same(appnexus.Client, client);
  }
});