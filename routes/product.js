var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data =
  {
	title : "Kitchenware",
  items: {
          name: "Flower Pot",
          price: "100",
          img: "images/k1.jpg"
        }
};
  res.render('product', data);
});

module.exports = router;
