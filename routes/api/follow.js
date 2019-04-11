var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require('../../db');

/* POST Upload an item. */
router.post('/', function(req, res, next) {

    //Compulsory parameters
    let follower_id = req.user.uid;
    if (follower_id === undefined) {
        return res.status(400).json({
            success: false,
            message: "Error getting uid of current user",
            data: null
        })
    }

    let following_id = req.body.following_id;
    if (following_id === undefined) {
        return res.status(400).json({
            success: false,
            message: "Error getting uid of user to follow",
            data: null
        })
    }

    db.query(`INSERT INTO user_following (follower_id, following_id) VALUES ($1, $2)`,
        [follower_id, following_id],
        (err, data) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    success: false,
                    message: "Error following user",
                    data: null
                });
            }

            console.log(data)

            return res.status(200).json({
                success: true,
                message: "Successfully followed user",
                data: null
            });


        }
    );

});

module.exports = router;