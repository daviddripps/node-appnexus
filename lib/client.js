/*global require */

var Campaign = require('./campaign');
var extend = require('extend');

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

  //merge in any custom options
  this.options = extend({}, DEFAULT_OPTIONS, options);

  //if we're in debug mode, then use the sandbox url
  if(this.options.debug === true) {
    this.options.url = this.options.sandboxUrl;
  }

  //add the request object to the Client for testing
  this.request = require('./request');

  //add an object for callbacks when the authenticate() method completes
  this.authListeners = [];

  /*
   * get an API token for future requests by the client
   */

  this.authenticate(function(err) {
    if(err) {
      throw err;
    }
  });
};

/**
 * Retrieves a 2-hour access token for the user corresponding to the login credentials provided in
 * the constructor
 *
 * @see https://wiki.appnexus.com/display/api/Authentication+Service
 * @returns {function({Error|null})}
 */
Client.prototype.authenticate = function(cb) {
  //if the user is already authed, just return
  if(this.authTime && Date.now() - this.authTime < TWO_HOURS) {
    return cb(null);
  }

  //if we still have to auth the user, then just add this callback to the auth listeners
  if(typeof cb === 'function') {
    this.authListeners.push(cb);
  }

  //if the auth request is already sent, just return while we wait for a response
  if(this.authRequestSent) { return; }

  this.authRequestSent = true;

  //just a convenience method to try and keep the code below readable and reduce SLOC
  var executeAuthListeners = function(error) {
    this.authListeners.forEach(function(callback) {
      callback(error);
    });

    //clear these callbacks from the listener
    this.authListeners = [];
  }.bind(this);

  //execute the request to get a session token from the AN API
  this.request('POST', this.options.url + '/auth', {
    auth: {
      username: this.username,
      password: this.password
    }
  }, function(err, body) {
    //mark this request as complete so we re-auth when this function is called again
    this.authRequestSent = false;

    //exit early if there's an error
    if(err) {
      //execute any waiting callbacks with the error
      return executeAuthListeners(err);
    }

    //set our auth time so we can compare later to determine if we need to get a new token
    this.authTime = Date.now();

    //store & return our session token
    this.token = body.token;

    //execute our callbacks
    return executeAuthListeners(null);
  }.bind(this));
};

Client.prototype.getCampaign = function(campaignId, cb) {
  this.authenticate(function(err) {
    if(err) {
      return cb(err);
    }

    return cb(null, new Campaign(campaignId, this));
  }.bind(this));
};

module.exports = Client;