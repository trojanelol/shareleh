var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data =
  {
	title : "Flower Pot",
  img: "images/si.jpg",
  rating: "4",
	price : "100",
	description :"Great as an example",
	location : "East",
	start_date: "04/09/2019",
	end_date: "04/29/2019",
  lender_username: "trojane",
  lender_rating: "5"
};
  res.render('single', data);
});

module.exports = router;
