const axios = require('axios');
const settings = require('../settings');

module.exports = {

  getLocation: address =>{

  const encodedAddress = encodeURIComponent(address);

  const googleURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${settings.GOOGLE_GEOCODE_KEY}`;

  return axios.get(googleURI)
          .then((response)=> {
            const {address_components} = response.data.results[0];
            const {location} = response.data.results[0].geometry;

            return {
              address_components,
              location
            };
          })
          .catch((err)=> {
              console.log(`Unable to find address: ${address}`);
          });
  },

  getWeather: coordinates =>{

    const darkSkyURL = `https://api.darksky.net/forecast/${settings.DARKSKY_API_KEY}/${coordinates.lat},${coordinates.lng}?exclude=flags&units=si`;

    return axios.get(darkSkyURL)
            .then(response =>{
              return response.data;
            })
            .catch((err)=> {
                console.log(`Trouble getting weather for your area`);
            });
  }

}
