var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var data =
  {
  	title : "Dashboard",
    tasks: [
        {task: "Upload one item", progress: "Done"},
        {task: "Borrow one item", progress: "Done"}
    ],
    loan_items: [
        {item: "Flower Pot", lender: "trojane", return_date: "04/29/2019" },
        {item: "Party Costumes", lender: "trojane", return_date: "04/29/2019" }
    ],
    listings: [
        {item: "Tupperware", borrower: "trojane", return_date: "04/29/2019" },
        {item: "Cooking Mama", borrower: "trojane", return_date: "04/29/2019" }
    ]
  };
  res.render('dashboard', data);
});

module.exports = router;
