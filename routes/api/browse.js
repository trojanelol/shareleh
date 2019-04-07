var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');

/* GET items. */
router.get('/', function(req, res, next) {

    //Get all filters
    let params = Object.entries(req.query);
    let numParams = params.length;

    //Parameters validation
    //Remove offset, limit and empty values from params

    // Map of parameters excluding limit and offset
    var validParams = new Map();
    validParams.set('price_floor', ' >= ');
    validParams.set('price_ceiling', ' <= ');
    validParams.set('location', ' = ');
    validParams.set('category', ' = ');
    validParams.set('start_date', ' <= ');
    validParams.set('end_date', ' >= ');
    validParams.set('keywords', ' LIKE ');
    validParams.set('rating', ' >= ');

    //Date regex - ignore if doesnt fit pattern
    let dateRegex = new RegExp("^((0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/[12]\\d{3})$");

    var filtered = params.filter(function(value, index, arr){

        if (value[1] === "") {
            return false;
        } else if (value[0] === 'start_date' || value[0] === 'end_date') {
            return dateRegex.test(value[1]);
        } else if (value[0] === 'limit' || value[0] === 'offset') {
            return false;
        }  else if (value[0] === 'keywords') {
            return false;
        } else if (validParams.has(value[0])) {
            return true;
        }
        //Invalid params not in validParams map
        return false;
    });

    //Prepare stored procedure
    var cond = [];
    var values = [];
    for(var i = 0; i < filtered.length; i++) {

        if(filtered[i][0] === 'price_floor' || filtered[i][0] === 'price_ceiling') {
            cond.push('price' + validParams.get(filtered[i][0]) + '$' + (i+1));
            values.push(filtered[i][1]);
            continue;

        } else if (filtered[i][0] === 'start_date' || filtered[i][0] === 'end_date') {
            cond.push(filtered[i][0] + validParams.get(filtered[i][0]) + 'to_date($' + (i+1) + `, 'MM/DD/YYYY')`);
            values.push(filtered[i][1]);
            continue;
        } else if (filtered[i][0] === 'category') {
            cond.push('cname' + validParams.get(filtered[i][0]) + '$' + (i+1));
            values.push(filtered[i][1]);
            continue;
        }
        cond.push(filtered[i][0] + validParams.get(filtered[i][0]) + '$' + (i+1));
        values.push(filtered[i][1])
    }

    //Name search
    var keywordsQueryText = "";
    var keywords = req.query.keywords;
    if (keywords !== undefined) {
        var splitKeywords = keywords.split(' ');
        if (cond.length > 0) {
            keywordsQueryText += " AND (";
        }
        keywordsQueryText += "name LIKE $" + (values.length+1);
        values.push(`%` + splitKeywords[0] + `%`);
        for (let i=1; i<splitKeywords.length; i++) {
            keywordsQueryText += " OR name LIKE $" + (values.length+1);
            values.push(`%` + splitKeywords[i] + `%`);
        }
        if (cond.length > 0) {
            keywordsQueryText += ")";
        }
    }
    var queryWhereText = "";
    if (values.length > 0 )
        queryWhereText = 'WHERE ' + cond.join(' AND ');

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
    //left join with item_categories last to prevent duplicates
    db.query(`WITH calc_avg AS (SELECT iid, ROUND(AVG(rating)::NUMERIC,2) AS rating FROM item_review GROUP BY iid), ` +
        `items_with_ratings AS (SELECT * FROM items LEFT JOIN calc_avg USING (iid)) ` +
        `SELECT DISTINCT items_with_ratings.* FROM items_with_ratings LEFT JOIN item_categories USING (iid) ` + queryWhereText + keywordsQueryText + limitOffsetText,
        values,
        (err, data) => {
            if (err !== undefined) {
                console.log(err)
                res.render("An error has occurred.");
            }
            res.json(data.rows)
        }
    );

});

module.exports = router;