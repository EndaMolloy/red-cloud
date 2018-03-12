const axios = require('axios');
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
const moment = require('moment');

const settings = require('../settings');

//scrape meteoalarm

module.exports = {

  getAlerts: () => {

    const alertURL = settings.METEO_URL;

    return axios.get(alertURL)
            .then(response =>{
              let formatedArr = [];
                parseString(response.data, (err, result)=> {

                  const alertArr = result.rss.channel[0].item;

                  //remove first item, generic country wide alert from array
                  alertArr.shift()

                  //format array into usable object
                  formatedArr = alertArr.map(location=>{
                    return {
                      location: [location.title[0]],
                      description: formatDetails(location.description[0])
                    }
                  })
                 .filter(arr =>{
                    if(arr.description.today.warning_today_status != '1' || arr.description.tomor.warning_tomor_status != '1'){
                      return true;
                    }
                 })
                })

                if(formatedArr.length){
                  const sortedArr = sortArray(formatedArr);
                  return removeDuplicates(sortedArr);
                }
                else{
                  return formatedArr;
                }
            });
  }

}


function sortArray(arr){
  let sortedArr = [];
  arr.forEach(v=>{
    if(v.description.today.warning_today_status == '1'){
      sortedArr.push({
        location: v.location,
        description: v.description.tomor
      });
    }
    else if(v.description.today.warning_today_status != '1'){
      if(JSON.stringify(v.description.today.warning_today_desc) === JSON.stringify(v.description.tomor.warning_tomor_desc)){
        v.description.today.warning_today_until = v.description.tomor.warning_tomor_until;
        sortedArr.push({
          location: v.location,
          description: v.description.today
        });
      }
      else{
        sortedArr.push({
          location: v.location,
          description: v.description.today
        })
      }
    }
    else{
      sortedArr.push({
        location: v.location,
        description: v.description.today
      });
      sortedArr.push({
        location: v.location,
        description: v.description.tomor
      })
    }
  })
  return sortedArr;
}


function removeDuplicates(arr){
  let finalArr = [];

  //put first alert into final array
  finalArr.push(arr.shift());

  //loop over array, remove duplicates and add locations with the same warning into one array
  arr.forEach(v=>{
    finalArr.forEach((elem, i)=> {
       if(JSON.stringify(elem.description) === JSON.stringify(v.description)){
         finalArr[i].location.push(v.location[0]);
       }else{
         finalArr.push(elem);
       }
     })
   })

   //format the finalArr
   return finalArrFormat(finalArr);
}


function finalArrFormat(arr){

  //check if all counties included, if so set to nationwide
  arr.forEach(v=>{
    if (v.location.length == 26) {
      v.location = ['Nationwide']
    }
    //format respective values to publishable format
    v.description.warning_today_desc = getDescFormat(v.description.warning_today_desc);
    v.description.warning_today_type = getWarningType(v.description.warning_today_type);
    v.description.warning_today_status = getColor(v.description.warning_today_status);
    v.description.warning_today_from = getTimeFormat(v.description.warning_today_from);
    v.description.warning_today_until = getTimeFormat(v.description.warning_today_until);
    v.expiration = getUnix(v.description.warning_today_until);
  })

  return arr;

}


function formatDetails(text){
  const $ = cheerio.load(text);

  //cheerio selectors today
  const warning_today_status = $('table > tbody > tr:nth-child(2) > td:nth-child(1) > img').attr('alt').split(':').pop();
  const warning_today_type = $('table > tbody > tr:nth-child(2) > td:nth-child(1) > img').attr('src').split('/').pop();
  const warning_today_from = $('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(2)').text();
  const warning_today_until = $('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(4)').text();
  const warning_today_desc = $('table > tbody > tr:nth-child(3) > td:nth-child(2)').text();

  //cheerio selectors tomorrow
  const warning_tomor_status = $('table > tbody > tr:nth-child(5) > td:nth-child(1) > img').attr('alt').split(':').pop();
  const warning_tomor_type = $('table > tbody > tr:nth-child(5) > td:nth-child(1) > img').attr('src').split('/').pop();
  const warning_tomor_from = $('table > tbody > tr:nth-child(5) > td:nth-child(2) > i:nth-child(2)').text();
  const warning_tomor_until = $('table > tbody > tr:nth-child(5) > td:nth-child(2) > i:nth-child(4)').text();
  const warning_tomor_desc = $('table > tbody > tr:nth-child(6) > td:nth-child(2)').text();


  return {
    today: {
      warning_today_desc,
      warning_today_type,
      warning_today_status,
      warning_today_from,
      warning_today_until

    },
    tomor: {
      warning_tomor_desc,
      warning_tomor_type,
      warning_tomor_status,
      warning_tomor_from,
      warning_today_until
    }
  }
}

function getWarningType(str){
  const weather_flag = str.split('.').shift().split('-').pop();
  let weather_type = '';

  switch (weather_flag) {
    case 't1':
      weather_type = 'Wind';
      break;
    case 't2':
      weather_type = 'Snow & Ice';
      break;
    case 't3':
      weather_type = 'Thunderstorms';
      break;
    case 't4':
      weather_type = 'Fog';
      break;
    case 't5':
      weather_type = 'Extreme high temperature';
      break;
    case 't6':
      weather_type = 'Extreme low temperature';
      break;
    case 't7':
      weather_type = 'Coastal Event';
      break;
    case 't8':
      weather_type = 'ForestFire';
      break;
    case 't9':
      weather_type = 'Avalanches';
      break;
    case 't10':
      weather_type = 'Rain';
      break;
    case 't11':
      weather_type = 'Flood';
      break;
    case 't12':
      weather_type = 'Rain-Flood';
      break;
  }
  return weather_type;
}

function getDescFormat(str){
  const splitStr = str.split("  ");
  return splitStr[1];
}

function getColor(num){
  let status = '';

  if(num == 4)
    status = 'Red'
  else if (num == 3) {
    status = 'Orange'
  }
  else if (num == 2) {
    status = 'Yellow'
  }
  else {
    status = 'Green'
  }
  return status;
}

function getTimeFormat(str){

  const splitStr = str.split(' ')
  splitStr.splice(-1)
  //
  const euro_date = splitStr[0].split('.');
  let js_date = `${euro_date[1]}.${euro_date[0]}.${euro_date[2]} ${splitStr[1]}`

  const CET = new Date(js_date);
  CET.setHours(CET.getHours()-1)

  return moment(CET).format('LT') +" "+ moment(CET).format('dddd Do MMMM');
}

function getUnix(str){
  const date = str.split('CET')
  return parseInt((new Date(date[0]).getTime() / 1000).toFixed(0))
}
