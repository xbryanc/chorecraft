// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

const passport = require('../passport');
const Parent = require('../models/Parent');
const Quest = require('../models/Quest');

const router = express.Router();

router.get('/getQuests',
    connect.ensureLoggedIn(),
    function(req, res) {
        let param = req.user.isParent ? "parentId" : "childrenId";
        Quest.find({[param]: req.user._id}, quests => {
            res.send(quests);
        });
});

router.post('/createQuest',
    connect.ensureLoggedIn(),
    function(req, res) {
        if (req.user.isParent) {
            const newQuest = new Quest({
                title: req.body.title,
                description: req.body.description,
                exp: req.body.exp,
                coins: req.body.coins,
                parentId: req.user._id,
                childrenId: req.body.childrenId,
            });
            newQuest.save((err, quest) => {
                if (err) console.log(err);
                res.send({done: true});
            });
        } else {
            res.status(403);
            res.send({done: false});
        }
});

router.post('/completeQuest',
    connect.ensureLoggedIn(),
    function(req, res) {
        if (req.user.isParent) {
            const questId = req.body.quest;
            const childId = req.body.child;
            Quest.findOne({_id: questId}, quest => {
                Child.findOne({_id: childId}, child => {
                    child.exp += quest.exp;
                    child.coins += quest.coins;
                    Child.findOneAndUpdate({_id: childId}, child, _ => {
                        res.send({done: true});
                    })
                });
            });
        } else {
            res.status(403);
            res.send({done: false});
        }
});

router.get('/echo', function(req, res) {
    res.send({message: req.query.message});
});

router.post('/signup', function(req, res, next) {
    passport.authenticate('signup', function(e, user, info) {
        if(e) return next(e);
        if(info) return res.status(400).send(info);
        return res.status(200).send({ redirect: '/home' });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/whoami', function(req, res) {
    if (req.user) {
        res.send(req.user.username);
    } else {
        res.send("not logged in");
    }
})

router.post('/login', 
    passport.authenticate('login'),
    function(req, res) {
        res.send('logged in!');
    }
);

module.exports = router;