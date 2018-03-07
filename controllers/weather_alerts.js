const axios = require('axios');
const {parseString} = require('xml2js');
const prettyjson = require('prettyjson');
const settings = require('../settings');
const cheerio = require('cheerio');
var beautify = require("json-beautify");

module.exports = {

  getAlerts: () => {

    const alertURL = settings.METEO_URL;
    console.log(alertURL);

    return axios.get(alertURL)
            .then(response =>{
                parseString(response.data, (err, result)=> {
                  const alertArr = result.rss.channel[0].item;
                  const formatedArr = alertArr.map(location=>{
                    return {
                      location: location.title[0],
                      description: location.description[0]
                    }
                  })

                  const $ = cheerio.load(formatedArr[1].description);

                  const warning_status = $('img').attr();
                  const warning_times = $('i').text();
                  const warning_desc = $('td').text();

                  console.log(warning_status);
                  console.log(warning_times);
                  console.log(warning_desc);

                  return JSON.stringify(result.rss.channel.title);
                })
            });
  }

}
