const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');

router.route('/:coordinates/:location')
  .get(async (req,res) => {
    try{
      const coords = req.params.coordinates.split(",");
      const address = {
        lat: coords[0],
        lng: coords[1]
      };

      const weatherData = await weather.getWeather(address);

      res.render('location', {
        // address_coord: address.location,
        // address: address.address_components[0].long_name,
        currently: weatherData.currently,
        minutely: weatherData.minutely,
        hourly: weatherData.hourly,
        daily: weatherData.daily
      });

    }
    catch(err){
      console.log(err);
    }

  });

module.exports = router;
