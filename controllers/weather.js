const axios = require('axios');
const settings = require('../settings');

module.exports = {

  getWeatherData: (address)=>{
  const encodedAddress = encodeURIComponent(address);

  const googleURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&${settings.GOOGLE_GEOCODE_KEY}`;


  axios.get(googleURI)
      .then((response)=> {
        const coordinates = response.data.results[0].geometry.location;
        console.log(coordinates);
        const darkSkyURL = `https://api.darksky.net/forecast/${settings.DARKSKY_API_KEY}/${coordinates.lat},${coordinates.lng}`
        console.log(darkSkyURL);
        return axios.get(darkSkyURL)
      })
       .then(response => {
         console.log(response.data);
       })
      .catch((err)=> {
          console.log(`Unable to find address: ${address}`);
      });
  }

}
