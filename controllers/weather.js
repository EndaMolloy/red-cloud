const axios = require('axios');
const settings = require('../settings');

module.exports = {

  getLocation: address =>{

  const encodedAddress = encodeURIComponent(address);

  const googleURI = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&components=country:IE&key=${settings.GOOGLE_GEOCODE_KEY}`;

  return axios.get(googleURI)
          .then((response)=> {
            const {address_components} = response.data.results[0];
            let {formatted_address} = response.data.results[0];
            const {location} = response.data.results[0].geometry;

            formatted_address_arr = formatted_address.split(',');
            //remove the "Ireland"
            formatted_address_arr.splice(formatted_address_arr.length-1,1);

            if(formatted_address_arr.length == 3 && hasNumber(formatted_address_arr[2])== true){
              formatted_address_arr.splice(2,1);
            }
            else if (formatted_address_arr.length == 3 && hasNumber(formatted_address_arr[2]) == false) {
              formatted_address_arr.splice(0,1);
            }

            formatted_address = formatted_address_arr.join(',');


            return {
              formatted_address,
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

function hasNumber(str) {
  return /\d/.test(str);
}
