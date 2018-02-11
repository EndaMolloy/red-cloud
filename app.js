require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const yargs = require('yargs');

const weather = require('./controllers/weather');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

// const argv = yargs
//   .options({
//     a: {
//       demand: true,
//       alias: 'address',
//       describe: 'get your weather data',
//       string: true
//     }
//   })
//   .help()
//   .alias('help', 'h')
//   .argv;
//
// weather.getWeatherData(argv.a)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started listening on port ${port}!`));
