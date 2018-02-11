const express = require('express');
const router = express.Router();

const weather = require('../controllers/weather');


router.route('/weather')
  .post((req,res,next)=> {
    console.log(req.body);
    // weather.getWeatherData()
    res.send('This worked.')
  })


module.exports = router;
