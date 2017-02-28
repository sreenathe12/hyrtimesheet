/**
 * Created by srina on 2/27/2017.
 */

var express = require('express');
var app = express();
var router = express.Router();
var User = require('../models/user');
var Employee = require('../models/employees');
var passport = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var generator = require('generate-password');

var passwords = generator.generate({
    length: 6,
    numbers: false
});


// ADMIN PAGE ****************************************************

router.get('/', function (req, res) {
    res.render('index.ejs');
});



router.get('/login', function (req, res) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

// router.post('/login',function (req,res) {
//     var email = req.body.email;
//     var password = req.body.password;
// });




passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});




passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
       //  passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
            User.findOne({'local.email': email}, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));






router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


router.get('/profile', function (req, res) {
    res.render('profile.ejs', {
        user: req.user
    });
});




router.get('/empcreate', function (req, res) {

    res.render('empcreate.ejs', {message: req.flash('empMessage'),messagee: passwords});
});





// router.post('/empcreate', passport.authenticate('local-signup', {
//     successRedirect : '/empcreated', // redirect to the secure profile section
//     failureRedirect : '/empcreate', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));


router.get('/empcreated', function (req, res) {
    res.render('empcreated.ejs', {message: req.flash('page not found')});
});


// ******************************************************EMPROUTER*******************




module.exports = router;

