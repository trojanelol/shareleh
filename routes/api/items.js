var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');
var request = require('request');

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
    var item_id = [];
    item_id.push(parseInt(itemID));

    db.query(`WITH specific_item AS (SELECT * FROM items WHERE iid = $1),
        item_calc_rating AS (SELECT iid, CASE WHEN (AVG(rating)- FLOOR(AVG(rating))) >= 0.5 THEN CEIL(AVG(rating)) ELSE FLOOR(AVG(rating)) END AS item_rating FROM item_review GROUP BY iid),
        item_rating AS (SELECT * FROM specific_item LEFT JOIN item_calc_rating USING (iid)),
        item_user AS (SELECT item_rating.*, users.username as lender_username FROM item_rating JOIN users ON item_rating.lender_id = users.uid), 
        user_calc_rating AS (SELECT lender_id, CASE WHEN (AVG(rating)- FLOOR(AVG(rating))) >= 0.5 THEN CEIL(AVG(rating)) ELSE FLOOR(AVG(rating)) END AS lender_rating FROM lender_review GROUP BY lender_id)
        SELECT * FROM item_user LEFT JOIN user_calc_rating USING (lender_id)`,
        item_id,
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting items",
                    data: null
                })
            }

            getItemReviews(req, res, data.rows[0], item_id);

        }
    );

});

function getItemReviews (req, res, itemInfo, item_id) {

    db.query(`WITH review AS (SELECT item_review.reviewer_id, item_review.rating, item_review.comments FROM items JOIN item_review USING (iid)WHERE iid = $1) 
        SELECT users.username, review.rating, review.comments FROM review JOIN users ON users.uid = review.reviewer_id`,
        item_id,
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
            getBidderInfo(req, res, itemInfo, item_id);
        }
    );

}

function getBidderInfo (req, res, itemInfo, item_id) {

    if (!req.user) {
        return res.status(400).json({
            success: false,
            message: "Error retrieving borrower ID",
            data: null
        })
    }
    let borrowerID = req.user.uid;


    // console.log("borrowerID:" + borrowerID);

    db.query(`SELECT * FROM rounds JOIN bids USING (rid) WHERE borrower_id = $1 ORDER BY bid_date DESC LIMIT 1`,
        [borrowerID],
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting bidding info for current borrower.",
                    data: null
                })
            }

            var userBidInfo = data.rows[0];
            var bidStatus = ""
            if (userBidInfo.winning_bid_id === null) {
                bidStatus = "Ongoing";
            } else if (userBidInfo.winning_bid_id === userBidInfo.bid) {
                bidStatus = "Accepted";
            } else if (userBidInfo.winning_bid_id !== userBidInfo.bid){
                bidStatus = "Rejected";
            }

            var itemPage = {
                item_info: itemInfo,
                bidding_info: {
                    previous_bidding_amount: userBidInfo.bid_price,
                    bidding_status: bidStatus
                }
            };

            getBids (req, res, itemPage, item_id);
        }
    );


}

function getBids (req, res, itemPage, item_id) {

    db.query(`
    WITH current_round AS (SELECT * FROM rounds WHERE iid = $1 ORDER BY rid DESC LIMIT 1),
    calc_avg AS (SELECT borrower_id, CASE WHEN (AVG(rating)- FLOOR(AVG(rating))) >= 0.5 THEN CEIL(AVG(rating)) ELSE FLOOR(AVG(rating)) END AS rating FROM borrower_review GROUP BY borrower_id),
    bids_with_ratings AS (SELECT * FROM bids LEFT JOIN calc_avg USING (borrower_id))
    SELECT * FROM current_round JOIN bids_with_ratings USING (rid);`,
        item_id,
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting bids for item",
                    data: null
                })
            }

            var fullItemPage = {
                item_info: itemPage.item_info,
                bidding_info: {
                    previous_bidding_amount: itemPage.bidding_info.previous_bidding_amount,
                    bidding_status: itemPage.bidding_info.bidding_status,
                    bids: data.rows
                }
            };

            res.json(fullItemPage);
        }
    );


}

module.exports = router;