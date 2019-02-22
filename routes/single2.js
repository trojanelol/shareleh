var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('single2', { title: 'Single 2' });
});

module.exports = router;
