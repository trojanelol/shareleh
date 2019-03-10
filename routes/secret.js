var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log("======================================== req ========================================");
  console.log(req);
  console.log("======================================== res ========================================");
  console.log(res);
  console.log("======================================== next ========================================");
  console.log(next);
  res.render('secret', { title: 'Secret'});
});

module.exports = router;
