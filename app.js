require('dotenv').config();
const yargs = require('yargs');

const weather = require('./controllers/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'get your weather data',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

weather.getWeatherData(argv.a)
