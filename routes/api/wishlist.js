var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');

/* POST Upload an item. */
router.get('/', function(req, res, next) {

    //Compulsory parameters
    let uid = req.query.uid;
    if (uid === undefined) {
        return res.status(400).json({
            success: false,
            message: "Error getting uid of current user",
            data: null
        })
    }

    //Get item id to add to wishlist
    let iid = req.query.iid;
    if (iid === undefined) {
        return res.status(400).json({
            success: false,
            message: "Error getting id of item to add to wishlist",
            data: null
        })
    }

    db.query(`INSERT INTO wishlist (uid, iid) VALUES ($1, $2)`,
        [uid, iid],
        (err, data) => {
            if (err) {
                console.log(err.stack)
                return res.status(500).json({
                    success: false,
                    message: "Error adding item to wishlist",
                    data: null
                });

            }

            done();

            return res.redirect('/dashboard')
            //Successful
            // return res.status(200).json({
            //     success: true,
            //     message: "Successfully added item to wishlist",
            //     data: null
            // });


        }
    );

});

module.exports = router;
