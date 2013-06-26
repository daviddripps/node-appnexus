var Campaign = require('./campaign');
//var creative = require('creative');
var extend = require('node-extend');
var request = require('request');

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

  /*
   * get an API token for future requests by the client
   */

  this.authenticate(function(err, token) {
    if(err) {
      throw new Error(err);
    } else {
      this.token = token;
    }
  }.bind(this));
};

/**
 * Retrieves a 2-hour access token for the user corresponding to the login credentials provided in
 * the constructor
 *
 * @returns {function({Error|null}, {string}}
 */
Client.prototype.authenticate = function(cb) {
  var requestOptions = {
    url: this.options.url + '/auth',
    method: 'POST',
    body: JSON.stringify({
      username: this.username,
      password: this.password
    })
  };

  request(requestOptions, function(err, response) {
    if(err) {
      return cb(err);
    }

    this.token = response.response.token;

    return cb(null, this.token);
  });
};

Client.prototype.getCampaign = function(campaignId) {
  return new Campaign(campaignId);
};

module.exports = Client;