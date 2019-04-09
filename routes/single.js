var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data =
  {
  username: "trojane",
	title : "Flower Pot",
  img: "images/si.jpg",
  rating: "5",
	price : "100",
	description :"Great as an example",
	location : "East",
	start_date: "04/09/2019",
	end_date: "04/29/2019",
  lender_username: "trojane",
  lender_rating: "5",
  previous_bidding_amount: "120",
  bidding_status: "Rejected",
  bidders: [
    {timestamp: "24/4/2019 0000", borrower_username: "butcher1234", bid_price:"120", borrower_rating:"4", description: "for wedding event"},
    {timestamp: "24/4/2019 2359", borrower_username: "butcher55", bid_price:"126", borrower_rating:"5", description: "for science experiment"}
  ],
  reviews: [
    {reviewee: "butcher1234", rating: "5", comment: "cool item"},
    {reviewee: "damner", rating: "5", comment: "you wish you met this item earlier"},
    {reviewee: "happyvalley", rating: "5", comment: "good"},
    {reviewee: "xiaoxuanyeo", rating: "5", comment: "5 STAR WHOOPS"}
  ]
};
  res.render('single', data);
});

module.exports = router;
