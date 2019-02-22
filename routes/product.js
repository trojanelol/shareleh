var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('product', { title: 'Product' });
});

module.exports = router;
