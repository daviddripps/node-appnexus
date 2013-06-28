/*global module */

/**
 * @param {number} campaignId
 * @param {Client} client
 * @throws {error}
 * @constructor
 */
var Campaign = function(campaignId, client) {
  //add the client object to the Campaign
  if(! client) {
    throw new Error('You must provide an AppNexus Client to create a new Campaign.');
  }

  this.client = client;

  //if we're retrieving an existing campaign, then store the ID and grab its data from AppNexus
  if(campaignId) {
    this.id = campaignId;
  }
};

/**
 * retrieves the campaign's data from teh AppNexus API
 *
 * @param {function({Error}, {Campaign})} cb
 */
Campaign.prototype.getInfo = function(cb) {
  if(! this.id) {
    return cb(Error('You must create a campaign before retrieving its information.'));
  }

  //if we've already requested the info from the API, just return the same result
  if(this.error || this.data) {
    return cb(this.error, this.data);
  }

  var client = this.client;
  var campaignInfoRequestUrl = client.options.url + '/campaign?id=' + this.id;

  client.request('GET', campaignInfoRequestUrl, { token: client.token }, function(err, body) {
    if(err) {
      this.error = err;

      return cb(err);
    }

    this.data = body.campaign;

    return cb(null, body.campaign);
  }.bind(this));
};

module.exports = Campaign;