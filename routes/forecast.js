const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');
const alerts = require('../controllers/alerts');

router.route('/:coordinates/:location')
  .get(async (req, res) => {
    try {

      const coords = req.params.coordinates.split(",");
      const location_text = req.params.location;
      const address = {
        lat: coords[0],
        lng: coords[1]
      };

      const weatherData = await weather.getWeather(address);

      const weatherAlerts = await alerts.getAlerts();

      console.log(weatherAlerts);

      res.render('location', {
        address_coord: address,
        address: location_text,
        currently: weatherData.currently,
        minutely: weatherData.minutely,
        hourly: weatherData.hourly,
        daily: weatherData.daily
      });

    } catch (err) {
      console.log(err);
    }

  });

module.exports = router;
