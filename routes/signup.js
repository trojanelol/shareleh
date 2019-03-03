var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
//   res.render('signup', { title: 'Signup' });
    res.send('Sign up')

});

module.exports = router;
