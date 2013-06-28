/**
 *
 * @param {number} campaignId
 * @param {Client} client
 * @constructor
 */
var Campaign = function(campaignId, client) {
  //add the client object to the Campaign
  this.client = client;

  //if we're retrieving an existing campaign, then store the ID and grab its data from AppNexus
  if(campaignId) {
    this.id = campaignId;
  }
};

/**
 * retrieves the campaign's data from teh AppNexus API
 * @param {FUnction({error|null}, {object}) cb
 */
Campaign.prototype.getInfo = function(cb) {
  if(! this.id) {
    return cb('You must create a campaign before retrieving its information.');
  }

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
  });
};

module.exports = Campaign;