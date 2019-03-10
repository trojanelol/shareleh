var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  const expressport = process.env.PORT || 3000;
  res.render('secret', { expressport: expressport});
});

module.exports = router;
