// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

const passport = require('../passport');
const Parent = require('../models/Parent');
const Child = require('../models/Child');
const Quest = require('../models/Quest');

const router = express.Router();

router.get('/getQuests',
    function(req, res) {
        if (!req.user) {
            res.send([]);
        } else {
            let param = req.user.isParent ? "parentId" : "childrenId";
            Quest.find({[param]: req.user._id}, quests => {
                res.send(quests || []);
            });
        }
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
        req.login(user, function(e) {
            if(e) { return next(e); }
            return res.status(200).send({ redirect: '/profile' });
        });
    })(req, res, next);
});

router.post('/add',
    connect.ensureLoggedIn(),
    function(req, res, next) {
        if(!req.user.isParent) {
            return res.status(403).send({ message: "not parent" });
        }
        const username = req.body.username;
        const password = req.body.password;
        Child.findOne({ username : username}, function(err, user) {
            if (err) { return next(err); }
            if (user) { return res.status(400).send({ message: "username already in use." }); }
            let newChild = new Child();
            newChild.username = username;
            newChild.password = password;
            newChild.parentId = req.user._id;
            newChild.save(function(err, child) {
                if(err) { return next(err); }
                return res.send({ message: "success" });
            })
        })
    }
);

router.post('/login', function(req, res, next) {
    passport.authenticate('login', function(e, user, info) {
        if(e) return next(e);
        if(info) return res.status(400).send(info);
        req.login(user, function(e) {
            if(e) { return next(e); }
            return res.status(200).send({ redirect: '/profile' });
        });
    })(req, res, next);
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/whoami', function(req, res) {
    if (req.user) {
        if (req.user.isParent) {
            Child.find({_id: { $all: req.user.childrenId }}, children => {
                let childNames = children ? children.map(c => c.username) : [];
                res.send({
                    username: req.user.username,
                    isParent: true,
                    children: req.user.childrenId,
                    childNames: childNames,
                });
            });
        } else {
            Child.find({_id: req.user._id}, child => {
                Parent.find({_id: child.parentId}, parent => {
                    res.send({
                        username: req.user.username,
                        isParent: false,
                        parentId: child.parentId,
                        parentName: parent.username,
                    });
                })
            });
        }
    } else {
        res.send({});
    }
});

module.exports = router;