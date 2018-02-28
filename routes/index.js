const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');

router.route('/')
  .get((req,res)=> {
    res.render('index')
  })

router.route('/weather/:coordinates/:location')
  .get(async (req,res) => {

    const location = req.params.location;
    console.log(location);

    // const address = {
    //   lat: location.lat,
    //   lng: location.lng
    // };
    // console.log("address: ", address);
    //
    // const weatherData = await weather.getWeather(address);
    //
    // console.log("daily: ", weatherData.daily);
    // res.render('location', {
    //   // address_coord: address.location,
    //   // address: address.address_components[0].long_name,
    //   currently: weatherData.currently,
    //   minutely: weatherData.minutely,
    //   hourly: weatherData.hourly,
    //   daily: weatherData.daily
    // });
    res.redirect(`/forecast/${req.params.coordinates}/${req.params.location}`);
  });

module.exports = router;
