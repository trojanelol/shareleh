var express = require('express');
var router = express.Router();
var app = express();
var request = require('request');
const querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (querystring.stringify(req.query) != ''){
    browseURL ="http://localhost:3000/api/browse/?" + querystring.stringify(req.query);
  }else{
    browseURL ="http://localhost:3000/api/browse/"
  }

  request(browseURL, function (error, response, body) {
      if (!error) {
          let data = JSON.parse(body) // Print the google web page.
          res.render('index', {Title: "Main Page", items: data});
      }

  })

  // let data = app.get('/api/browse')
  //
  // res.render('index', data);
  // // res.send(string/JSON/array)
  // //res.redirect(path)
});

module.exports = router;
