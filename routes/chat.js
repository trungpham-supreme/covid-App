var express = require('express');
var router = express.Router();

const {forwardAuthenticated, ensureAuthenticated, isAdmin } = require('../config/auth');


router.get('/',ensureAuthenticated, function(req, res){
	res.render('chat');
});

module.exports = router;