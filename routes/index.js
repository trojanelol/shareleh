var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ShareLeh Main Page' });
  // res.send(string/JSON/array)
  //res.redirect(path)
});

module.exports = router;
