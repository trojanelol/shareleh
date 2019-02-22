var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('single', { title: 'Single' });
});

module.exports = router;
