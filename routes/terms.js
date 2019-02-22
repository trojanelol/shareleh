var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('terms', { title: 'Terms' });
});

module.exports = router;
