var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');

/* GET a specific item. */
router.get('/', function(req, res, next) {

    let itemID = req.query.iid;
    if (isNaN(itemID)) {
        return res.status(400).json({
            success: false,
            message: "Item ID is invalid",
            data: null
        })
    }
    var values = [];
    values.push(parseInt(itemID));

    var result1 = 5;

    db.query(`WITH specific_item AS (SELECT * FROM items WHERE iid = $1),
        item_calc_rating AS (SELECT iid, CASE WHEN (AVG(rating)- FLOOR(AVG(rating))) >= 0.5 THEN CEIL(AVG(rating)) ELSE FLOOR(AVG(rating)) END AS item_rating FROM item_review GROUP BY iid),
        item_rating AS (SELECT * FROM specific_item LEFT JOIN item_calc_rating USING (iid)),
        item_user AS (SELECT item_rating.*, users.username as lender_username FROM item_rating JOIN users ON item_rating.lid = users.uid), 
        user_calc_rating AS (SELECT lid, CASE WHEN (AVG(rating)- FLOOR(AVG(rating))) >= 0.5 THEN CEIL(AVG(rating)) ELSE FLOOR(AVG(rating)) END AS lender_rating FROM lender_review GROUP BY lid)
        SELECT * FROM item_user LEFT JOIN user_calc_rating USING (lid)`,
        values,
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting items",
                    data: null
                })
            }

            getItemReviews(res, data.rows[0], values);

        }
    );

});

function getItemReviews (res, itemInfo, values) {

    db.query(`WITH review AS (SELECT item_review.reviewer_id, item_review.rating, item_review.comments FROM items JOIN item_review USING (iid)WHERE iid = $1) 
        SELECT users.username, review.rating, review.comments FROM review JOIN users ON users.uid = review.reviewer_id`,
        values,
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting item reviews",
                    data: null
                })
            }

            Object.assign(itemInfo, {item_reviews: data.rows});
            res.json(itemInfo);
        }
    );

}

module.exports = router;