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
  
    res.redirect(`/forecast/${req.params.coordinates}/${req.params.location}`);
  });

module.exports = router;
