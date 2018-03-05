const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');
const alerts = require('../controllers/alerts');
const helpers = require('../helpers/handlebars');

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

      const rolling_metrics = JSON.stringify([
        {
          "Sunrise": helpers.toTime(weatherData.daily.data[0].sunriseTime),
          "Sunset": helpers.toTime(weatherData.daily.data[0].sunsetTime)
        },
        {
          "Min": weatherData.daily.data[0].temperatureLow+ '°',
          "Max": weatherData.daily.data[0].temperatureHigh+ '°'
        },
        {
          "Cloud cover": weatherData.currently.cloudCover,
          "UV Index": weatherData.currently.uvIndex
        },
        {
          "Humidity": weatherData.currently.humidity+'%',
          "Pressure": weatherData.currently.pressure+ 'mbar'
        }
      ])


      res.render('location', {
        rolling_metrics: rolling_metrics,
        weatherAlerts: weatherAlerts,
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
