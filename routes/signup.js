var express = require('express')
var router = express.Router()

router.post('/', function(req, res, next) {
    const { Pool } = require('pg')
    const pool = new Pool({
        // these variables will searched for in the .env file
        // make a copy of .env.sample and rename it to .env, then fill in the variables with your own postgres username and password
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    })

    storeUserInDB(pool, res)

    //TODO
    //No duplicates
    //Hash the password
    //Find out if creating and importing a global pool is possible and how
    //use the .env file
    //redirect user instead of sending a json response
});

function storeUserInDB(pool, res){
    
    var userEmail = 'jh@shareleh.com'
    var userPassword = '1234'
    var select_query = 'SELECT * FROM users'
    var insert_query = "INSERT INTO users (email, password) VALUES ('" + userEmail + "', '" + userPassword + "');"

    pool.query(insert_query, function(err, data) {
        if (err) {
            console.error('Error executing query', err.stack)
            return
        }

        //Chaining Queries
        pool.query(select_query, function(err, data) {
            if (err) {
                console.error('Error executing query', err.stack)
                return
            }

            res.send(data)
        })
    })

}


module.exports = router
