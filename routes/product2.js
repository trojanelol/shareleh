var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('product2', { title: 'Product 2' });
});

module.exports = router;
