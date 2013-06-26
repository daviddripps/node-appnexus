/*global require */

var Campaign = require('./campaign');
//var Creative = require('./creative');
var extend = require('node-extend');

var TWO_HOURS = 1000 * 60 * 60 * 2;
var DEFAULT_OPTIONS = {
  url: 'https://api.appnexus.com',
  sandboxUrl: 'http://sand.api.appnexus.com'
};

/**
 * The AppNexus API Client
 *
 * @param {string} username
 * @param {string} password
 * @param {object} [options]
 * @constructor
 */
var Client = function(username, password, options) {
  if(! username) {
    throw new Error('You must provide a username to the AppNexus Client.');
  }

  if(! password) {
    throw new Error('You must provide a password to the AppNexus Client.');
  }

  this.username = username;
  this.password = password;

  /*
   * setup our options
   */

  this.options = DEFAULT_OPTIONS;

  for(var option in options) {
    this.options[option] = options[option];
  }

  //add the request object to the Client for testing
  this.request = require('./request');

  /*
   * get an API token for future requests by the client
   */

  this.authenticate(function(err) {
    if(err) {
      throw new Error(err);
    }
  });
};

/**
 * Retrieves a 2-hour access token for the user corresponding to the login credentials provided in
 * the constructor
 *
 * @see https://wiki.appnexus.com/display/api/Authentication+Service
 * @returns {function({Error|null}, {string}}
 */
Client.prototype.authenticate = function(cb) {
  this.request('POST', this.options.url + '/auth', {
    auth: {
      username: this.username,
      password: this.password
    }
  }, function(err, response, body) {
    if(err) {
      return cb(err);
    }

    this.authTime = Date.now();

    this.token = body.response.token;

    return cb(null, this.token);
  }.bind(this));
};

Client.prototype.isAuthed = function() {
  return Date.now() - this.authTime < TWO_HOURS;
};

Client.prototype.getCampaign = function(campaignId) {
  return new Campaign(campaignId);
};

module.exports = Client;