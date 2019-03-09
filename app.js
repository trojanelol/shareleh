var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').load();
require('dotenv').config();

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

var app = express();

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
