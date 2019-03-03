var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
//   res.render('signin', { title: 'Signin' });
    res.send('Sign in')

});

module.exports = router;
