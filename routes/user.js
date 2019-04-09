var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data =
  {
	title : "User Profile",
  user: {
    name: "trojane",
    ratings: "5",
    reviews: [
      {reviewee: "butcher1234", rating: "5", comment: "cool lender"},
      {reviewee: "damner", rating: "5", comment: "you wish you met her earlier"},
      {reviewee: "happyvalley", rating: "5", comment: "good"},
      {reviewee: "xiaoxuanyeo", rating: "5", comment: "5 STAR WHOOPS"}
    ]
  }
};
  res.render('user', data);
});

module.exports = router;
