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

    //Compulsory parameter
    let itemID = req.body.iid;
    if (itemID === undefined) {
        return res.status(400).json({
            success: false,
            message: "Error getting item id",
            data: null
        })
    }

    //Connect to db for transaction
    db.connect((err, client, done) => {

        const shouldAbort = (err) => {
            if (err) {
                console.error('Error in transaction', err.stack);
                client.query('ROLLBACK', (err) => {
                    if (err) {
                        console.error('Error rolling back client', err.stack)
                    }
                    // release the client back to the pool
                    done()
                })
            }
            return !!err
        };

        client.query('BEGIN', (err) => {
            if (shouldAbort(err)) return;
            client.query(`INSERT INTO rounds (iid) VALUES ($1) RETURNING rid`, [itemID], (err, data) => {
                if (shouldAbort(err)) return;
                const roundID = data.rows[0].rid;

                client.query(`UPDATE items (current_round, available) VALUES ($1, $2)`, [itemID, roundID], (err, data) => {
                    if (shouldAbort(err)) return;

                    client.query('COMMIT', (err) => {
                        if (err) {
                            console.error('Error committing transaction', err.stack)
                            return res.status(500).json({
                                success: false,
                                message: "Error committing item upload transaction",
                                data: null
                            })
                        }
                        done();

                        return res.json({
                            success: true,
                            message: "Item returned",
                            data: null
                        })
                    })
                })
            })
        })
    }) //End of transaction
}