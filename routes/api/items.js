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
    console.log(typeof(itemID))
    if (isNaN(itemID)) {
        return res.json({
            success: false,

        })
    }
    var values = [];
    values.push(parseInt(itemID));

    db.query(`WITH specific_item AS (SELECT * FROM items WHERE iid = $1), ` +
        `item_calc_rating AS (SELECT iid, ROUND(AVG(rating)::NUMERIC,2) AS item_rating FROM item_review GROUP BY iid), ` +
        `item_rating AS (SELECT * FROM specific_item LEFT JOIN item_calc_rating USING (iid)), ` +
        `item_user AS (SELECT item_rating.*, users.uid, users.first_name, users.username FROM item_rating JOIN users ON item_rating.lid = users.uid), ` +
        `user_calc_rating AS (SELECT lid, ROUND(AVG(rating)::NUMERIC,2) AS user_rating FROM lender_review GROUP BY lid) ` +
        `SELECT * FROM item_user LEFT JOIN user_calc_rating USING (lid)`,
        values,
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                res.render("An error has occurred.");
            }

            res.json(data.rows)
        }
    );

});

module.exports = router;