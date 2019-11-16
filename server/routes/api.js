// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

const passport = require('../passport');
const Parent = require('../models/Parent');

const router = express.Router();

router.get('/echo', function(req, res) {
    res.send({message: req.query.message});
});

router.post('/signup', function(req, res, next) {
    passport.authenticate('signup'),
    
});

router.post('/login', 
    passport.authenticate('login'),
    function(req, res) {
        res.send('logged in!');
    }
);

module.exports = router;