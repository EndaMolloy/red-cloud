const axios = require('axios');
const cheerio = require('cheerio');
const settings = require('../settings');

module.exports = {

  getAlerts: () => {

    const alertURL = settings.ALERT_URL;

    return axios.get(alertURL)
            .then(response =>{

              const $ = cheerio.load(response.data);
              let alert = [];

              const warning_text = $('#warning').first().text();
              const text_array = warning_text.split('STATUS').filter(e => e.length > 5);

              return status_alerts(text_array);
              // const headline_row = text_array[0].split(' ');
              // return formatHeadline(headline_row[3]);
              // const status = text_array[0].split(' ');
              // return status[4];
              // const duration = $('.wtime').each(function(i, elm){
              //   alert[i] = $(this).text();
              // })

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

  // if(text.indexOf('RED')!== -1)
  //   status = 'Red';
  //
  // if (text.indexOf('ORANGE')!== -1)
  //   status = 'Orange';
  //
  // else if (text.indexOf('YELLOW')!== -1)
  //   status = 'Yellow';
  //
  // let type = text.substring(status.length);
  //
  // if(type.indexOf('-'))
  //   type = type.replace('-', ' & ');
  //
  // return {
  //   status,
  //   type
  // };

}

function formatWarning(warning){
  const split = warning.split('\n');

  //remove any spaces
  const trim = split.map(el => el.trim());

  //remove empty array elements
  const nonEmpty = trim.filter(el => el.length);


  console.log(nonEmpty);
  return{
    status: split[3]
  }
}
