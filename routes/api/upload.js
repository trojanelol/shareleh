var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');

/* POST Upload an item. */
router.post('/', function(req, res, next) {

    var columns = [];
    var cond = [];
    var values = [];

    //Compulsory parameters
    let lenderID = req.user.uid;
    if (lenderID === undefined) {
        return res.status(400).json({
            status: false,
            message: "Error retrieving lender ID",
            data: null
        })
    }
    columns.push("lid");
    cond.push("$" + (cond.length+1));
    values.push(lenderID);

    let name = req.body.name;
    if (name === undefined) {
        return res.status(400).json({
            status: false,
            message: "Error getting item name",
            data: null
        })
    }
    columns.push("name");
    cond.push("$" + (cond.length+1));
    values.push(name);

    //Optional parameters
    let price = req.body.price;
    if (price !== undefined) {
        columns.push("price");
        cond.push("$" + (cond.length+1));
        values.push(price);
    }

    let description = req.body.description;
    if (description !== undefined) {
        columns.push("description");
        cond.push("$" + (cond.length+1));
        values.push(description);
    }

    let location = req.body.location;
    if (location !== undefined) {
        columns.push("location");
        cond.push("$" + (cond.length+1));
        values.push(location);
    }

    let startDate = req.body.start_date;
    if (startDate !== undefined) {
        columns.push("start_date");
        cond.push("to_date($" + (cond.length+1) + ", 'MM/DD/YYYY')");
        values.push(startDate);
    }

    console.log(startDate)
    console.log("to_date($" + (cond.length+1) + ", 'MM/DD/YYYY')")

    let endDate = req.body.end_date;
    if (endDate !== undefined) {
        columns.push("end_date");
        cond.push("to_date($" + (cond.length+1) + ", 'MM/DD/YYYY')");
        values.push(endDate);
    }

    var queryColumnText = "(" + columns.join(', ') + ")";
    var queryCondText = "(" + cond.join(', ') + ")";


    db.query(`INSERT INTO items ` + queryColumnText + ` VALUES ` + queryCondText,
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