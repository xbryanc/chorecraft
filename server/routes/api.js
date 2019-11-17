// dependencies
const express = require('express');
const connect = require('connect-ensure-login');

const passport = require('../passport');
const Parent = require('../models/Parent');
const Child = require('../models/Child');
const Quest = require('../models/Quest');
const Reward = require('../models/Reward');

const router = express.Router();

router.get('/getQuests',
    function(req, res) {
        if (!req.user) {
            res.send([]);
        } else {
            let param = req.user.isParent ? "parentId" : "childrenId";
            Quest.find({[param]: req.user._id}, (err, quests) => {
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
            Quest.findOne({_id: questId}, (_, quest) => {
                let questChildren = quest.childrenId;
                if (questChildren.includes(childId)) {
                    Child.findOne({_id: childId}, (_, child) => {
                        child.exp += quest.exp;
                        child.coins += quest.coins;
                        Child.findOneAndUpdate({_id: childId}, child, () => {
                            questChildren.splice(questChildren.indexOf(childId), 1);
                            if (!questChildren.length) {
                                Quest.findOneAndRemove({_id: questId}, () => {
                                    res.send({done: true});
                                });
                            } else {
                                Quest.findOneAndUpdate({_id: questId}, {childrenId: questChildren}, () => {
                                    res.send({done: true});
                                });
                            }
                        });
                    });
                } else {
                    res.send({done: false});
                }
            });
        } else {
            res.status(403);
            res.send({done: false});
        }
    }
);

router.get('/getRewards',
    connect.ensureLoggedIn(),
    function(req, res) {
        const parentId = req.user.isParent ? req.user._id : req.user.parentId;
        Reward.find({ parentId : parentId }, function(err, rewards) {
            res.send(rewards || []);
        });
    }
);

router.post('/createReward',
    connect.ensureLoggedIn(),
    function(req, res) {
        if (req.user.isParent) {
            const newReward = new Reward({
                title: req.body.title,
                description: req.body.description,
                cost: req.body.cost,
                parentId: req.user._id,
                purchasedBy: []
            });
            newReward.save(function(err, reward) {
                res.send("done");
            });
        } else {
            res.status(400).send({ message: "Explorers cannot create rewards!" });
        }
    }
);

router.post('/purchaseReward',
    connect.ensureLoggedIn(),
    function(req, res) {
        if (!req.user.isParent) {
            Reward.findById(req.body.rewardId, function(err, reward) {
                if (reward.purchasedBy.indexOf(req.user._id) != -1) {
                    return res.status(400).send({ message: "You have already purchased this reward." });
                }
                Child.findById(req.user._id, function(err, user) {
                    if (user.coins < reward.cost) {
                        return res.status(400).send({ message: "Not enough coins :'(" });
                    }
                    user.coins -= reward.cost;
                    reward.purchasedBy.push(user._id);
                    Reward.findByIdAndUpdate(reward._id, reward, () => {
                        Child.findByIdAndUpdate(user._id, user, () => {
                            res.send("purchased!");
                        });
                    });
                });
            });
        } else {
            res.status(400).send({ message: "Quest Masters cannot purchase rewards!" });
        }
    }
);

router.get('/echo', function(req, res) {
    res.send({message: req.query.message});
});

router.post('/signup', connect.ensureLoggedOut(), function(req, res, next) {
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
            if (user) { return res.send({ message: "username already in use." }); }
            let newChild = new Child();
            newChild.username = username;
            newChild.password = password;
            newChild.parentId = req.user._id;
            newChild.save(function(err, child) {
                if(err) { return next(err); }
                Parent.findOne({_id: req.user._id}, (_, parent) => {
                    let childrenId = parent.childrenId;
                    childrenId.push(child._id);
                    Parent.findOneAndUpdate({_id: req.user._id}, {childrenId: childrenId}, function() {
                        return res.send({ message: "success" });
                    });
                });
            });
        })
    }
);

router.post('/login', connect.ensureLoggedOut(), function(req, res, next) {
    passport.authenticate('login', function(e, user, info) {
        if(e) return next(e);
        if(info) return res.status(400).send(info);
        req.login(user, function(e) {
            if(e) { return next(e); }
            return res.status(200).send({ redirect: '/profile' });
        });
    })(req, res, next);
});

router.get('/logout', connect.ensureLoggedIn(), function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/whoami', function(req, res) {
    if (req.user) {
        if (req.user.isParent) {
            Parent.findOne({_id: req.user._id}, (_, parent) => {
                Child.find({_id: { $in: parent.childrenId }}, (_, children) => {
                    let childInfo = children.map(c => ({
                        _id: c._id,
                        username: c.username,
                        exp: c.exp,
                        coins: c.coins,
                    }));
                    res.send({
                        _id: req.user._id,
                        username: req.user.username,
                        isParent: true,
                        children: childInfo,
                    });
                });
            })
        } else {
            Child.findOne({_id: req.user._id}, (_, child) => {
                Parent.findOne({_id: child.parentId}, (_, parent) => {
                    Child.find({ _id: { $in: parent.childrenId } }, (_, children) => {
                        let siblingInfo = children
                            .filter(c => c._id != req.user._id)
                            .map(c => ({
                                _id: c._id,
                                username: c.username,
                                exp: c.exp,
                                coins: c.coins,     
                            }));
                        res.send({
                            _id: req.user._id,
                            username: req.user.username,
                            isParent: false,
                            parentId: child.parentId,
                            parentName: parent.username,
                            exp: child.exp,
                            coins: child.coins,
                            siblings: siblingInfo,
                        });
                    });
                });
            });
        }
    } else {
        res.send({});
    }
});

module.exports = router;