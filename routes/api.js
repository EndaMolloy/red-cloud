const express = require('express');
const router = express.Router();

const weather = require('../controllers/weather');


router.route('/weather')
  .post(async (req,res)=> {
    try {
      // const address = await weather.getLocation(req.body.address);
      // const weatherData = await weather.getWeather(address.location);
      // //console.log(address);
      // console.log(weatherData.daily);
      // res.render('location', {
      //   address_coord: address.location,
      //   address: address.address_components[0].long_name,
      //   currently: weatherData.currently,
      //   minutely: weatherData.minutely,
      //   hourly: weatherData.hourly,
      //   daily: weatherData.daily
      // });
      res.redirect('/weather/'+req.body.address)
    }
    catch (e) {
      res.redirect('/')
    }
  })



module.exports = router;
