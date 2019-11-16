const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Parent = require('./models/Parent');
const Child = require('./models/Child');

function processUser(err, user, isParent, done) {
    if (err) { return done(err); }
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }
    if (!(user.password === password)) {
        return done(null, false, { message: 'Incorrect password.' });
    }
    user.isParent = isParent;
    return done(null, user);
}

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
},
    function (req, username, password, done) {
        if (req.body.isParent) {
            Parent.findOne({ username: username }, function(err, user) {
                return processUser(err, user, true, done);
            });
        } else {
            Child.findOne({ username: username }, function(err, user) {
                return processUser(err, user, false, done);
            })
        }
    }
));

passport.use('signup', new LocalStrategy(function(req, username, password, done) {
    Parent.findOne({ username: username}, function(err, user) {
        if (err) { return done(err); }
        if (user) { return done(null, false, { message: 'Username already taken.' })}
        let newUser = new Parent();
        newUser.username = username;
        newUser.password = password;
        newUser.save(function(err) {
            if (err) { throw err; }
            newUser.isParent = true;
            return done(null, newUser);
        })
    })
}));

passport.serializeUser(function(user, done) { done(null, user); });
passport.deserializeUser(function(user, done) { done(null, user); });

module.exports = passport;