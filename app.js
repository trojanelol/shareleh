var express = require('express');
var app = express();
const querystring = require('querystring');
var session = require('express-session')
app.use(session({
  secret: 'somerandomstring',
  name: 'cookie_name',
  proxy: true,
  resave: false,
  saveUninitialized: false
}));
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var request = require('request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').load();
require('dotenv').config();

//==========//
// Postgres //
//==========//
const db = require('./db');

//------------//
// Passportjs //
//------------//
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => done(null, user["username"]));
passport.deserializeUser((username, done) => {
  db.query("SELECT uid,username FROM users WHERE username = $1", [username],
    (err, data) => {
      if (err || data.rows.length != 1)
        return done(err);
      else {
        return done(null, {
          // access these deserialized details at req.user (a json object)
          uid : data.rows[0]['uid'],
          username : data.rows[0]['username'],
          name : data.rows[0]['name'],
        });
      }
    }
  );
});
passport.use(new LocalStrategy((username, password, done) => {
  db.query( 'SELECT * FROM users WHERE username=$1', [username],
    (err, data) => {
      if (err || data.rows.length != 1)
        return done(err);
      else {
        bcrypt.compare(password, data.rows[0]['password'], (err, isValid) => {
          if (err) return done(err);
          if (!isValid) return done(null, false);
          return done(null, {
            username: data.rows[0]['username'],
            passwordHash: data.rows[0]['password']
          });
        })
      }
    }
  );
}));
app.use(function (req, res, next) {
  res.locals.signedin = req.isAuthenticated();
  next();
});
app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) { next() }
  else { res.redirect('/') }
}

//----------//
// zzsignup //
//----------//
app.get('/zzsignup', function(req, res, next) {
  // res.json(JSON.decycle(req)) // For debugging, uncomment this to inspect req
  res.send(`
  <h1>zzSignUp</h1>
  <form action="/zzsignup", method="post">
    <label for="username">username: </label>
    <input type="text" name="username" autocomplete="off">
    <br>
    <label for="password">password: </label>
    <input type="text" name="password" autocomplete="off">
    <br>
    <input type="submit" value="Submit">
  </form>
  `);
});
app.post('/zzsignup', function zzsignup(req, res, next) {
  var username  = req.body['username'];
  var password  = bcrypt.hashSync(req.body['password'], bcrypt.genSaltSync(10));
  db.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, password],
    (err, data) => {
      if(err) {
        res.redirect('/index');
      } else {
        passport.authenticate('local')(req, res, ()=>{res.redirect('/')});
        // res.send(`
        // <h1>zzSignup success, check the database</h1>
        // <pre><a href="/">Go back and sign in again.</a></pre>
        // `);
      }
    }
  );
});

//----------//
// zzsignin //
//----------//
app.get('/zzsignin', function(req, res, next) {
  // res.json(JSON.decycle(req)) // For debugging, uncomment this to inspect req
  res.send(`
  <h1>zzsignin</h1>
  <form action="/zzsignin", method="post">
    <label for="username">username: </label>
    <input type="text" name="username" autocomplete="off">
    <br>
    <label for="password">password: </label>
    <input type="text" name="password" autocomplete="off">
    <br>
    <input type="submit" value="Submit">
  </form>
  `);
});
app.post(
  '/zzsignin',
  passport.authenticate('local', { failureRedirect: '/signinfail' } ),
  function(req, res, next) {
    // res.json(JSON.decycle(req)) // For debugging, uncomment this to inspect req
    res.redirect('/');
    // res.send(`
    // <h1>Login Success</h1>
    // <pre>
    // username is : ${req.body['username']}<br>
    // password is : ${req.body['password']}<br>
    // <a href="/">Return home.</a>
    // </pre>
    // `);
  }
);
app.get('/signinfail', function(req, res, next) {
  res.redirect('/');
});
app.get('/signout', function(req, res){
  req.logout();
  res.redirect('/');
});

// GET testdb : Test database connection
app.get('/testdb', (req, res) => {
  db.query('SELECT NOW()', (qerr, qres) => {
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
  db.query(input, (qerr, qres) => {
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
app.use('/secret', checkAuthentication, require('./routes/secret'));

var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var wishlistRouter = require('./routes/wishlist');
var contactRouter = require('./routes/contact');
var faqsRouter = require('./routes/faqs');
var helpRouter = require('./routes/help');
var paymentRouter = require('./routes/payment');
var privacyRouter = require('./routes/privacy');
var productRouter = require('./routes/product');
var singleRouter = require('./routes/single');
var termsRouter = require('./routes/terms');
var dashboard2Router = require('./routes/dashboard2');
var uploadRouter = require('./routes/upload');
var userRouter = require('./routes/user');

//APIs
var browseApiRouter = require('./routes/api/browse');
var itemsApiRouter = require('./routes/api/items');
var uploadApiRouter = require('./routes/api/upload');
var returnApiRouter = require('./routes/api/return');
var followApiRouter = require('./routes/api/follow');
var wishlistApiRouter = require('./routes/api/wishlist');
var dashboardApiRouter = require('./routes/api/dashboard');

app.post('/postbid', function(req, res, next) {
  // res.json(JSON.decycle(req.body)) // For debugging, uncomment this to inspect req
  var rid = (req.body['rid'] instanceof Array) ? Math.max.apply(null, req.body['rid']) : req.body['rid'];
  var borrower_id = req.body['uid'];
  var bid_price = req.body['borrower_price'];
  var bid_comments = req.body['borrower_comments'];
  var return_date = req.body['return_date'];
  var iid = req.body['iid'];
  db.query(`INSERT INTO
    bids (rid, borrower_id, bid_price, bid_comments, return_date)
    VALUES ($1, $2, $3, $4, $5)`,
    [rid, borrower_id, bid_price, bid_comments, return_date],
    (err, data) => {
      console.log(`INSERT INTO bids (rid, borrower_id, bid_price, bid_comments, return_date) 
      VALUES (${rid}, ${borrower_id}, ${bid_price}, ${bid_comments}, ${return_date})`);
      if (!err) {
        // res.redirect(`/`);
        res.send(`<pre>Successfully bidded! <a href="javascript:history.go(-1)">Go Back.</a></pre>`);
      } else {
        res.send(err.stack);
      }
    }
  );
});
app.post('/choosebid', function(req, res, next) {
  // res.json(JSON.decycle(req.body)) // For debugging, uncomment this to inspect req
  var rid = (req.body['rid'] instanceof Array) ? Math.max.apply(null, req.body['rid']) : req.body['rid'];
  var bid = req.body['bid'];
  var iid = req.body['iid'];
  db.query(`UPDATE rounds SET winning_bid_id=$1 where rid=$2`, [bid, rid], (err, data) => {
    if (!err) {
      db.query(`INSERT INTO rounds (rid, iid, winning_bid_id)
      VALUES (default, $1, null) RETURNING rid`, [iid], (err, data) => {
        if (!err) {
          var last_inserted_rid = data.rows[0]['rid'];
          db.query(`UPDATE items SET current_round=$1, 
            available=FALSE WHERE iid = $2`, [last_inserted_rid, iid], (err, data) => {
            if (!err) {
              res.send(`<pre>Successfully chosen winning bid! <a href="javascript:history.go(-1)">Go Back.</a></pre>`);
            } else {
              res.json(err.stack);
            }
          });
        } else {
          res.json(err.stack);
        }
      });
    } else {
      res.send(err.stack);
    }
  });
});
app.get('/coolstats', (req, res, next) => {
  db.query(`SELECT location, ((COUNT(*) * 100)/(select count(*) from items)) AS percentage 
  FROM items GROUP BY location ORDER BY location;`, (err, data) => {
    if (!err) {
      res.json(data.rows);
    } else {
      res.send(err.stack);
    }
  });
})

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
app.use('/wishlist', checkAuthentication, wishlistRouter);
app.use('/contact', contactRouter);
app.use('/faqs', faqsRouter);
app.use('/help', helpRouter);
app.use('/payment', paymentRouter);
app.use('/privacy', privacyRouter);
app.use('/product', productRouter);
app.use('/single', checkAuthentication, singleRouter);
app.use('/terms', termsRouter);
app.use('/dashboard2', checkAuthentication, dashboard2Router);
app.use('/upload', checkAuthentication, uploadRouter);
app.use('/user', checkAuthentication, userRouter);

//APIs
app.use('/api/browse', browseApiRouter);
app.use('/api/items', itemsApiRouter);
app.use('/api/upload', checkAuthentication, uploadApiRouter);
app.use('/api/return', checkAuthentication, returnApiRouter);
app.use('/api/follow', checkAuthentication, followApiRouter);
app.use('/api/wishlist', checkAuthentication, wishlistApiRouter);
app.use('/api/dashboard', checkAuthentication, dashboardApiRouter);

app.get('/zzbrowse', (req, res, next) => {
  request({
    url: `http://localhost:${process.env.PORT}/api/browse`,
    method: 'GET'
  }, function (error, response, body) {
    if (!error) {
      res.render('zzitems', { items: JSON.parse(body)});
    } else {
      res.send(error);
    }
  });
});
app.get('/zzitems', (req, res, next) => {
  res.json(req.body);
  request({
    url: `http://localhost:${process.env.PORT}/api/browse`,
    body: req.body,
    method: 'POST'
  }, function (error, response, body) {
    if (!error) {
      res.render('zzitems', { items: JSON.parse(body)});
    } else {
      res.send(error);
    }
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
