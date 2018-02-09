const rp = require('request-promise');
const settings = require('../settings');

module.exports = {

  geocodeAddress: (address)=>{
  const encodedAddress = encodeURIComponent(address);

  const options = {
      uri: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&`,
      qs: {
          key: settings.GOOGLE_GEOCODE_KEY // -> uri + '?access_token=xxxxx%20xxxxx'
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
  };

  rp(options)
      .then((body)=> {
          console.log(body.results[0].formatted_address);
      })
      .catch((err)=> {
          console.log(err);
      });
  }

}
