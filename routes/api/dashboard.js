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

            getLoanItems(req, res, data.rows, uid);

        }
    );

});

function getLoanItems (req, res, tasks, uid) {

    db.query(`WITH rounds_bids AS (SELECT * FROM rounds JOIN bids USING (rid) WHERE borrower_id = $1),
with_items AS (SELECT * FROM rounds_bids JOIN items USING (iid))
SELECT * FROM with_items JOIN users ON with_items.lender_id = users.uid`,
        [uid],
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting item reviews",
                    data: null
                })
            }

            //Determine items currently on loan
            var filtered = (data.rows).filter(function(value, index, arr){

                if (value.rid === value.current_round) {
                    if (value.bid === value.winning_bid_id) {
                        return true;
                    }
                }
                return false;
            });

            var loanItems = []
            //Format the items on loan
            filtered.forEach(function(element) {
                var itemOnLoan = {
                    item: element.name,
                    lender: element.username,
                    return_date: element.return_date
                };
                loanItems.push(itemOnLoan)
            });


            var valuesToPass = {
                tasks: tasks,
                loan_items: loanItems
            };

            getListings(req, res, valuesToPass, uid)
        }
    );

}

function getListings (req, res, valuesPassed, uid) {

    db.query(`SELECT items.name, items.available FROM items WHERE lender_id = $1`,
        [uid],
        (err, data) => {
            if (err !== undefined) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error getting item reviews",
                    data: null
                })
            }

            //Format for response
            dashboardInfo = {
                tasks: valuesPassed.tasks,
                loan_items: valuesPassed.loan_items,
                listings: data.rows
            };

            // res.json(dashboardInfo)
            res.send(`
            <h1>Your Dashboard</h1>
            <pre>
            Your Task Info is : ${JSON.stringify(dashboardInfo.tasks)}<br>
            Your Listing is : ${JSON.stringify(dashboardInfo.listings)}<br>
            <a href="/">Return home.</a>
            </pre>
            `);

        }
    );

}

module.exports = router;
