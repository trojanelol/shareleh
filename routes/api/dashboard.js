var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');
var request = require('request');

/* GET user data. */
router.get('/', function(req, res, next) {

    let uid = req.query.uid;
    console.log(uid)
    if (isNaN(uid)) {
        return res.status(400).json({
            success: false,
            message: "User ID is invalid",
            data: null
        })
    }

    //Get tasks
    db.query(`WITH user_specific AS (SELECT * FROM user_tasks WHERE uid = $1)
SELECT tasks.*, CASE WHEN uid = 1 THEN TRUE ELSE FALSE END AS progress FROM tasks LEFT JOIN user_specific USING (task_name);`,
        [uid],
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting tasks",
                    data: null
                })
            }

            console.log(data.rows)

            return res.json(data.rows)
            // getLoanItems(req, res, data.rows[0], uid);

        }
    );

});

function getLoanItems (req, res, info, uid) {

    db.query(`WITH rounds_bids AS (SELECT * FROM rounds JOIN bids USING (rid) WHERE borrower_id = 5)
SELECT * FROM rounds_bids JOIN items USING (iid);`,
        [itemID],
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
            getBidderInfo(req, res, itemInfo, itemID);
        }
    );

}

module.exports = router;