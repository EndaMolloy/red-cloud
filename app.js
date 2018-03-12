require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const expressHandlebars = require('express-handlebars');
const compression = require('compression');

const weather = require('./controllers/weather');
const settings = require('./settings');

const app = express();

// compress all responses
app.use(compression())

//app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// View Engine
app.set('views', path.join(__dirname, 'views'));
const hbsHelpers = expressHandlebars.create({
  defaultLayout: 'layout',
  extname: '.handlebars',
  helpers: require('./helpers/handlebars.js')
});
app.engine('handlebars', hbsHelpers.engine);
app.set('view engine', 'handlebars');


app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/forecast', require('./routes/forecast'));

// catch 404 placeholder
app.use((req, res, next) => {
  res.render('notFound');
});

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server started listening on port ${port}!`));
