const axios = require('axios');
const settings = require('../settings');

module.exports = {

  getLocation: address =>{

  const encodedAddress = encodeURIComponent(address);

  const googleURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&${settings.GOOGLE_GEOCODE_KEY}`;

  return axios.get(googleURI)
          .then((response)=> {
            const {formatted_address} = response.data.results[0];
            const {location} = response.data.results[0].geometry;

            return {
              formatted_address,
              location
            };
          })
          .catch((err)=> {
              console.log(`Unable to find address: ${address}`);
          });
  },

  getWeather: coordinates =>{

    const darkSkyURL = `https://api.darksky.net/forecast/${settings.DARKSKY_API_KEY}/${coordinates.lat},${coordinates.lng}`;

    return axios.get(darkSkyURL)
            .then(response =>{
              return response.data;
            })
            .catch((err)=> {
                console.log(`Trouble getting weather for your area`);
            });
  }

}
