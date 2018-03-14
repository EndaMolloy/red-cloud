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
                    if(arr.description.today[0].warning_today_0_status != '1'){
                      return true;
                    }
                 })
                 .filter(arr => {
                   if(arr.location[0] == 'Ireland West' || arr.location[0] == 'Ireland South' || arr.location[0] == 'Irish Sea' || arr.location[0] == 'Ireland North-West'){
                     return false;
                   }else{
                     return true;
                   }
                 })
                })

                if(formatedArr.length){
                  const separatedArr = separateWarnings(formatedArr);
                  return removeDuplicates(separatedArr);
                }
                else{
                  return formatedArr;
                }
            });
  }

}

function separateWarnings(arr){
  const separated = arr.map(v=> {
    let today = [];
    v.description.today.forEach(el=> {
      today.push({
        location: [v.location[0]],
        description: {
          today: el
        }
      });
    })
    return today;
  })
  .reduce((acc,curr) => acc.concat(curr),[])
  .map(v => {
    if(v.description.today.warning_today_1_desc)
      return {
          location: [v.location[0]],
          description: {
            today: {
              warning_today_desc : v.description.today.warning_today_1_desc,
              warning_today_type : v.description.today.warning_today_1_type,
              warning_today_status : v.description.today.warning_today_1_status,
              warning_today_from : v.description.today.warning_today_1_from,
              warning_today_until : v.description.today.warning_today_1_until
            }
          },
          expiration : "",
          start : ""
      }
    else {
      return {
        location: [v.location[0]],
        description: {
          today: {
            warning_today_desc : v.description.today.warning_today_0_desc,
            warning_today_type : v.description.today.warning_today_0_type,
            warning_today_status : v.description.today.warning_today_0_status,
            warning_today_from : v.description.today.warning_today_0_from,
            warning_today_until : v.description.today.warning_today_0_until
          }
        },
        expiration : "",
        start : ""
      }
    }
  })


  return separated;
}


function removeDuplicates(arr){
  let dups = [];

  let unique = arr.filter(elm =>{
    if(dups.indexOf(elm.description.today.warning_today_desc) == -1){
      dups.push(elm.description.today.warning_today_desc);
      return true;
    }
      return false;
  })


  //loop over array, remove duplicates and add locations with the same warning into one array
  unique.forEach((v, i) =>{
    arr.forEach((elem, j) => {
       if(JSON.stringify(elem.description) === JSON.stringify(v.description) && elem.location[0] !== v.location[0]){
         unique[i].location.push(elem.location[0]);
       }
     })
   })

   unique = unique.filter(v => {
     if (v.description.today.warning_today_status == undefined || v.description.today.warning_today_status == null){
      return false;
    }
    else {
      return true;
    }
   })


   //format the finalArr
   return finalArrFormat(unique);
}


function finalArrFormat(arr){

  //check if all counties included, if so set to nationwide
  arr.forEach(v=>{
    if (v.location.length == 26) {
      v.location = ['Nationwide']
    }

    //format respective values to publishable format
    v.description.warning_today_desc = getDescFormat(v.description.today.warning_today_desc);
    v.description.warning_today_type = getWarningType(v.description.today.warning_today_type);
    v.description.warning_today_status = getColor(v.description.today.warning_today_status);
    v.expiration = getUnix(v.description.today.warning_today_until);
    v.start = getUnix(v.description.today.warning_today_from);
    v.description.warning_today_from = getTimeFormat(v.description.today.warning_today_from);
    v.description.warning_today_until = getTimeFormat(v.description.today.warning_today_until);
  })

  //sort based on earliest date
  arr.sort((a,b)=> {
    return new Date(a.start) - new Date(b.start);
  });

  return arr;
}


function formatDetails(text){
  const $ = cheerio.load(text);

  //cheerio selectors today
  const warning_today_0_status = $('table > tbody > tr:nth-child(2) > td:nth-child(1) > img').attr('alt').split(':').pop();
  const warning_today_0_type = $('table > tbody > tr:nth-child(2) > td:nth-child(1) > img').attr('src').split('/').pop();
  const warning_today_0_from = $('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(2)').text();
  const warning_today_0_until = $('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(4)').text();
  const warning_today_0_desc = $('table > tbody > tr:nth-child(3) > td:nth-child(2)').text();

  const warning_today_1_status = ($('table > tbody > tr:nth-child(4) > td:nth-child(1) > img').attr('alt') == undefined) ? null : $('table > tbody > tr:nth-child(4) > td:nth-child(1) > img').attr('alt').split(':').pop();
  const warning_today_1_type = ($('table > tbody > tr:nth-child(4) > td:nth-child(1) > img').attr('src') == undefined) ? null: $('table > tbody > tr:nth-child(4) > td:nth-child(1) > img').attr('src').split('/').pop();
  const warning_today_1_from = ($('table > tbody > tr:nth-child(4) > td:nth-child(2) > i:nth-child(2)').text() == undefined) ? null : $('table > tbody > tr:nth-child(4) > td:nth-child(2) > i:nth-child(2)').text();
  const warning_today_1_until = ($('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(4)').text() == undefined) ? null : $('table > tbody > tr:nth-child(2) > td:nth-child(2) > i:nth-child(4)').text();
  const warning_today_1_desc = $('table > tbody > tr:nth-child(5) > td:nth-child(2)').text();

  return {
    today: [{
      warning_today_0_desc,
      warning_today_0_type,
      warning_today_0_status,
      warning_today_0_from,
      warning_today_0_until
    },
    {
      warning_today_1_desc,
      warning_today_1_type,
      warning_today_1_status,
      warning_today_1_from,
      warning_today_1_until
    }]
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
      weather_type = 'Rainfall';
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
  if(str.includes('english')){
    const splitStr = str.split("  ");
    return splitStr[1];
  }else{
    return str;
  }

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

  let js_date = jsDateFormat(str);

  const CET = new Date(js_date);
  CET.setHours(CET.getHours()-1)

  return moment(CET).format('LT') +" "+ moment(CET).format('dddd Do MMMM');
}

function jsDateFormat(str){
  const splitStr = str.split(' ');
  splitStr.splice(-1);

  const euro_date = splitStr[0].split('.');
  return `${euro_date[1]}.${euro_date[0]}.${euro_date[2]} ${splitStr[1]}`;
}

function getUnix(str){
  const date = jsDateFormat(str);
  const newDate = parseInt((new Date(date).getTime() / 1000).toFixed(0))
  //console.log(newDate);
  return newDate;
}
