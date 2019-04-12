var express = require('express');
var router = express.Router();
var request = require('request');
var app = express();

router.get('/', function(req, res, next) {
  dashURL ="http://localhost:3000/api/dashboard/?uid=" + req.user.uid;


  request(dashURL, function (error, response, body) {
      // if (!error) {
      //     let data = JSON.parse(body) // Print the google web page.
      //     res.render('dashboard', {Title: "Dashboard", tasks: data});
      // }
      console.log(body)
  })
});

module.exports = router;
