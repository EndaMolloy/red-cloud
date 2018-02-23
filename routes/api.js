const express = require('express');
const router = express.Router();

const weather = require('../controllers/weather');


router.route('/weather')
  .post(async (req,res)=> {
    try {
      const address = await weather.getLocation(req.body.address);
      const weatherData = await weather.getWeather(address.location);
       
      res.render('location', {
        address: address.address_components[0].long_name,
        currently: weatherData.currently,
        minutely: weatherData.minutely,
        hourly: weatherData.hourly,
        daily: weatherData.daily
      });
    }
    catch (e) {
      res.redirect('/')
    }
  })



module.exports = router;
