/*global require, module */
var request = require('request');

/**
 * executes the HTTP(S) request to the specified url
 *
 * @param {String} method - the HTTP method of the request
 * @param {String} url - the absolute or relative HTTP URL of the requested resource
 * @param {Object} data - (optional) data to be sent in the body of a POST, PUT, or DELETE request
 * @param {Function({Error}, {HTTPResponse}, {Object})} cb - callback to return the response body
 */
module.exports = function(method, url, data, cb) {
  //make data optional
  if(typeof data === 'function') {
    cb = data;
    data = {};
  }

  //generic object for adding headers to the request
  var headers = {};

  //set the authorization token if we have one
  if(data.token) {
    headers.Authorization = data.token;

    delete data.token;
  }

  //if the data is a JSON object, then make it a string and set the correct headers
  if(typeof data === 'object') {
    data = JSON.stringify(data);
  }

  var requestOptions = {
    url: url,
    method: method,
    body: data,
    headers: headers
  };

  request(requestOptions, function(err, response, body) {
    //try to parse the response body
    try {
      body = JSON.parse(body);
      //if the resBody is an object, use the "response" param
      body = body.response;
    } catch(ignore) {}

    //if the request returned an error, then return the error
    if(! body.status || body.status.toUpperCase() !== 'OK') {
      return cb(new Error(body.error), null, response);
    }

    return cb(null, body, response);
  });
};
