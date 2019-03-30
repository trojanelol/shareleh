var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

require('dotenv').load();
require('dotenv').config();

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// initialize passport
app.use(passport.initialize());

// Postgres
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// GET testdb : Test database connection
app.get('/testdb', (req, res) => {
  pool.query('SELECT NOW()', (qerr, qres) => {
    if (qerr) {
      res.json(qerr.stack);
    } else {
      qres.rows[0]["user"] = process.env.DB_USER;
      qres.rows[0]["host"] = process.env.DB_HOST;
      qres.rows[0]["database"] = process.env.DB_DATABASE;
      qres.rows[0]["password"] = process.env.DB_PASSWORD;
      qres.rows[0]["port"] = process.env.DB_PORT;
      qres.rows[0]["connection"] = "successful";
      res.json(qres.rows);
    }
  })
});

/*
God function that handles all postgres queries
input can either be an SQL string -OR-
a json object of the following schema e.g
{
  text: 'INSERT INTO users(name, email) VALUES($1, $2)',
  values: ['brianc', 'brian.m.carlson@gmail.com'],
}
*/
function poolquery(input, output) {
  pool.query(input, (qerr, qres) => {
    if (qerr) {
      output.json(qerr.stack);
    } else {
      output.json(qres.rows);
    }
  });
}

// GET table/:tname --> Show table
app.get('/table/:tname', (req, res) => {
  var query = 'SELECT * FROM ' + req.params['tname'];
  poolquery(query, res)
});

// Helper function to remove circular references in object so we can print it out
JSON.decycle=function(n,e){"use strict";var t=new WeakMap;return function n(o,r){var c,i;return void 0!==e&&(o=e(o)),"object"!=typeof o||null===o||o instanceof Boolean||o instanceof Date||o instanceof Number||o instanceof RegExp||o instanceof String?o:void 0!==(c=t.get(o))?{$ref:c}:(t.set(o,r),Array.isArray(o)?(i=[],o.forEach(function(e,t){i[t]=n(e,r+"["+t+"]")})):(i={},Object.keys(o).forEach(function(e){i[e]=n(o[e],r+"["+JSON.stringify(e)+"]")})),i)}(n,"$")};

// POST query --> Process query (json) and return result (json)
app.post('/secret/query', (req, res) => {
  // res.json(JSON.decycle(req)) // For debugging, uncomment this to inspect req
  poolquery(req.body, res);
});

// Route get requests to /secret
app.use('/secret', require('./routes/secret'));

app.post('/zzzlogin', );

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var checkoutRouter = require('./routes/checkout');
var contactRouter = require('./routes/contact');
var faqsRouter = require('./routes/faqs');
var helpRouter = require('./routes/help');
var paymentRouter = require('./routes/payment');
var privacyRouter = require('./routes/privacy');
var productRouter = require('./routes/product');
var product2Router = require('./routes/product2');
var singleRouter = require('./routes/single');
var single2Router = require('./routes/single2');
var termsRouter = require('./routes/terms');
var signInRouter = require('./routes/signin');
var signUpRouter = require('./routes/signup');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{index : false}));

app.use('/', indexRouter);
app.use('/index', indexRouter);
app.use('/about', aboutRouter);
app.use('/checkout', checkoutRouter);
app.use('/contact', contactRouter);
app.use('/faqs', faqsRouter);
app.use('/help', helpRouter);
app.use('/payment', paymentRouter);
app.use('/privacy', privacyRouter);
app.use('/product', productRouter);
app.use('/product2', product2Router);
app.use('/single', singleRouter);
app.use('/single2', single2Router);
app.use('/terms', termsRouter);
app.use('/signin', signInRouter);
app.use('/signup', signUpRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
