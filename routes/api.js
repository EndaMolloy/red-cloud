const express = require('express');
const router = express.Router();

const weather = require('../controllers/weather');


router.route('/weather')
  .post(async (req,res)=> {
    try {
      const address = await weather.getLocation(req.body.address);
      const weatherData = await weather.getWeather(address.location);
      res.send(weatherData.timezone)
    }
    catch (e) {
      console.log(e);
    }
  })


module.exports = router;
