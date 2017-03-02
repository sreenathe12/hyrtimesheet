/**
 * Created by srina on 2/27/2017.
 */

var express = require('express');
var app = express();
var router = express.Router();
var User = require('../models/user');
var Time = require('../models/timesheet');
var Employee = require('../models/employees');
var passport = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var flash=require("connect-flash");
router.use(flash());

router.get('/', function (req, res) {
    res.render('index.ejs');
});

router.get('/emplogin', function (req, res) {
    res.render('emplogin.ejs', {message: req.flash('loginMessage')});
});




passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    Employee.findById(id, function (err, user) {
        done(err, user);
    });
});


// ************************************************************************NEW ONE ***********************************

router.post('/empcreate', function(req, res){

    var newUser = new Employee({
            name: req.body.name,
            email:req.body.email,
            password: req.body.password
        });
    // Employee.findEmployeeByemail({'email':email},function (err) {
    //     if(err) throw err;
    //     console.log("Email alredy taken");
    //     });

    Employee.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
    res.redirect('/empcreated');
    var helper = require('sendgrid').mail;
        var from_email = new helper.Email('srinathchandrae25@gmail.com');
        var to_email = new helper.Email(req.body.email);
        var subject = 'HYR TIME SHEET CREDENTIALS...';
        var content = new helper.Content('text/plain','Hi.. '+req.body.name + 'Please use below email and password to login in into Employer login , email: '+req.body.email + '  password: '+req.body.password );
        var mail = new helper.Mail(from_email, subject, to_email, content);

        var sg = require('sendgrid')("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");
        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
        });

        sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
        });




});



passport.use('local', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function () {
            Employee.findOne({'email': email,'password':password}, function (err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false,req.flash('loginMessage', 'Please enter valid Credentials..'));

                // all is well, return user
                else
                    return done(null, user);
            });

        });

    }));


router.post('/emplogin', passport.authenticate('local', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/emplogin', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// router.get('/dashboard', passport.authenticate('local', {
//     successRedirect: '/dashboard', // redirect to the secure profile section
//   //  failureRedirect: '/dashboard', // redirect back to the signup page if there is an error
//     failureFlash: true // allow flash messages
// }));

router.get('/dashboard',function(req, res,user) {
    res.render('dashboard.ejs');
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});



//Saving the Employer Time sheet and success ******************
router.get('/timesaved',function (req,res) {
    res.render('thankyou.ejs');
});

router.post('/dashboard',function (req,res) {
    var newTime = new Time();
    newTime.timelocal.name = req.body.name;
    newTime.timelocal.startdate = req.body.startdate;
    newTime.timelocal.enddate = req.body.enddate;
    newTime.timelocal.hours = req.body.hours;
    newTime.save(function (err) {
        if(err){
            throw err;
        }

    });
    res.redirect('/timesaved');
    var helper = require('sendgrid').mail;
    var from_email = new helper.Email('srinathchandrae25@gmail.com');
    var to_email = new helper.Email('saig12e@yahoo.com');
    var subject = 'HYR TIME SHEET CREDENTIALS...';
    var content = new helper.Content('text/plain','Hi..Raju Garu, This is '+req.body.name + 'number of hours i worked in this week is '+req.body.hours + 'start data is: '+req.body.startdate +'end date is: '+req.body.enddate);
    var mail = new helper.Mail(from_email, subject, to_email, content);

    var sg = require('sendgrid')("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");
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });
});

// function EnsureAuthenticated(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     } else {
//         //req.flash('error_msg','You are not logged in');
//         res.redirect('/');
//     }
// }

// function ensureOnlyuser(req, res, next) {
//     if (isEmployee(req.user)) { return next(); }
//     res.redirect('/emplogin');
// }

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}




module.exports = router;
























// router.post('/empcreate', passport.authenticate('local-signup', {
//     successRedirect : '/empcreated', // redirect to the secure profile section
//     failureRedirect : '/empcreate', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));


//    passport.use('local-signup', new LocalStrategy({
//         // empname : 'empname',
//          usernameField :'email',
//          passwordField : 'password',
//        passReqToCallback : true
//    },
//     function (req,email,empname, password, done) {
//         process.nextTick(function () {
//             user.findOne({'emplocal.email':email},function (err,user) {
//                 if(err)
//                     return done(err);
//                 // if(user) {
//                 //     return done(null, false, req.flash('signupMessage', 'That email alredy taken'));
//                 // }
//                 else {
//                     var newUser = new user();
//                     newUser.emplocal.empname = empname;
//                     newUser.emplocal.empemail = email;
//                   //   newUser.emplocal.emppassword = newUser.generateHash(password);;
//
//                     newUser.save(function (err) {
//                         if(err)
//                             throw err;
//                         return done(null,newUser);
//                     })
//                 }
//             })
//         });
//     }
// ));
//