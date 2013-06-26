/*global require */
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
    data = null;
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

  request(requestOptions, cb);
};

//this is the code form the HTML5 D:30 that I know works if the above doesn't

///**
// * executes the HTTP(S) request to the specified url
// *
// * @param {String} method - the HTTP method of the request
// * @param {String} url - the absolute or relative HTTP URL of the requested resource
// * @param {Object} data - (optional) data to be sent in the body of a POST, PUT, or DELETE request
// * @param {Function({Error}, {String}, {HTTPResponse})} cb - callback to return the response body
// */
//self.makeRequest = function(method, url, data, cb) {
//  //make data optional
//  if(typeof data === 'function') {
//    cb = data;
//    data = null;
//  }
//
//  //generic object for adding headers to the request
//  var headers = {};
//
//  //parse the url or endpoint
//  var requestOptions = urlParser.parse(url);
//  //add the request method to the options
//  requestOptions.method = method.toUpperCase();
//
//  //add the AppNexus hostname if a relative path was provided as the url
//  if(! requestOptions.host && ! requestOptions.hostname) {
//    requestOptions.hostname = config.hostname;
//  }
//
//  //add the config protocol if a relative path was provided as the url
//  if(! requestOptions.protocol) {
//    requestOptions.protocol = config.protocol;
//  }
//
//  //if the data is a JSON object, then make it a string and set the correct headers
//  if(typeof data === 'object') {
//    data = JSON.stringify(data);
//
//    headers['Content-Type'] = 'application/json';
//    headers['Content-Length'] = data.length;
//  }
//
//  //set the authorization token if we have one
//  if(self.isAuthed()) {
//    headers.Authorization = self.token;
//  }
//
//  //add the headers to the request options
//  requestOptions.headers = headers;
//
//  //get a reference to the protocol, then delete it from teh requestOptions
//  var requestProtocol = requestOptions.protocol.replace(':','');
//  delete requestOptions.protocol;
//
//  //set the port in requestOptions to 443 if the protocol is https
//  if(requestProtocol === 'https') {
//    requestOptions.port = 443;
//  }
//
//  //make the request
//  var httpClient = require(requestProtocol);
//  var req = httpClient.request(requestOptions , function(res) {
//    res.setEncoding('utf-8');
//
//    var resBody = '';
//
//    res.on('data', function(data) {
//      resBody += data;
//    });
//
//    res.on('end', function() {
//      //try to parse the response body
//      try {
//        resBody = JSON.parse(resBody);
//        //if the resBody is an object, use the "response" param
//        resBody = resBody.response;
//      } catch(ignore) {}
//
//      //if the request returned an error, then return the error
//      if(! resBody.status || resBody.status.toUpperCase() !== 'OK') {
//        return cb(new Error(resBody.error), null, res);
//      }
//
//      return cb(null, resBody, res);
//    });
//  });
//
//  req.on('error', function(err) {
//    return cb(err);
//  });
//
//  //write the data to the request if supplied
//  if(data) {
//    req.write(data);
//  }
//
//  req.end();
//};