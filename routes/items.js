var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../db')

/* GET items. */
router.get('/', function(req, res, next) {

    //Get all filters
    let params = Object.entries(req.query);
    let numParams = params.length;

    //Remove offset, limit and empty values from params
    var filtered = params.filter(function(value, index, arr){
        if (value[0] === 'limit' || value[0] === 'offset') {
            return false;
        } else if (value[1] === "") {
            return false;
        }
        return true;
    });

    //Prepare stored procedure
    var cond = [];
    var values = [];
    for(var i = 0; i < filtered.length; i++) {
        cond.push(filtered[i][0] + ' = $' + (i+1));
        values.push(filtered[i][1])
    }

    if (cond.length > 0) {
        var queryWhereText = 'WHERE ' + cond.join(' AND ');
    }

    //Offset and limit
    var limitOffsetText = "";
    var limit = req.query.limit;
    if (limit !== undefined) {
        limitOffsetText += " LIMIT $" + (values.length+1);
        values.push(limit);
    }
    var offset = req.query.offset;
    if (offset !== undefined) {
        limitOffsetText += " OFFSET $" + (values.length+1);
        values.push(offset);
    }


    //Execute query
    db.query('SELECT * FROM items ' + queryWhereText + limitOffsetText,
        values,
        (err, data) => {
            res.json(data.rows)
        }
    );

});

module.exports = router;