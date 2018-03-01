const express = require('express');
const router = express.Router();

const weather = require('../controllers/weather');


router.route('/weather')
  .post(async (req, res) => {
    try {
      const address = await weather.getLocation(req.body.address);
      const lat = address.location.lat.toFixed(3);
      const lng = address.location.lng.toFixed(3);
      const address_text = address.address_components[0].long_name;

      res.redirect(`/forecast/${lat},${lng}/${address_text}`);
    } catch (e) {
      res.redirect('/')
    }
  })



module.exports = router;
