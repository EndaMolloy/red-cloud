const express = require('express');
const router = express.Router();
const weather = require('../controllers/weather');

router.route('/')
  .get((req,res)=> {
    res.render('index')
  })

module.exports = router;
