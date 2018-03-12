const axios = require('axios');
const cheerio = require('cheerio');
const settings = require('../settings');

//scrape met.ie

module.exports = {

  getAlerts: () => {

    const alertURL = settings.ALERT_URL;

    return axios.get(alertURL)
            .then(response =>{

              const $ = cheerio.load(response.data);

              const warning_text = $('#warning').first().text();

              if(warning_text){
                const text_array = warning_text.split('STATUS').filter(e => e.length > 5);
                return status_alerts(text_array);
              }
              else{
                return [];
              }

            })
            .catch((err)=> {
                console.log(`Trouble getting weather alerts at this time`);
            });
  }
};


function status_alerts(array){

  let alertArr = [];

  array.forEach(warning=> {
    alertArr.push(formatWarning(warning))
  })

  return alertArr;

}

function formatWarning(warning){
  const split = warning.split('\n');

  //remove any spaces
  const trim = split.map(el => el.trim());

  //remove empty array elements
  const nonEmpty = trim.filter(el => el.length);


  const alertData = getHeadlineData(nonEmpty[0])



  return{
    status_color: alertData.status,
    weather_type: alertData.weather_type,
    area: alertData.area,
    description: getDescription(nonEmpty[1]),
    valid_until: getDuration(nonEmpty[3])
  }
}

function getHeadlineData(str){
  let arr = str.split(' ');
  const firstEl = arr[0];
  let status = '';

  if(firstEl.indexOf('RED')!== -1)
    status = 'Red';

  if (firstEl.indexOf('ORANGE')!== -1)
    status = 'Orange';

  if (firstEl.indexOf('YELLOW')!== -1)
    status = 'Yellow';

  let weather_type = firstEl.substring(status.length);

  if(weather_type.indexOf('-'))
    weather_type = weather_type.replace('-', ' & ');

  const area = str.substring(firstEl.length).trim();

  return {
    status,
    weather_type,
    area
  };
}

function getDescription(str){
  return str.replace('Update','').trim();
}

function getDuration(str){
  return str.replace('Valid:','');
}
