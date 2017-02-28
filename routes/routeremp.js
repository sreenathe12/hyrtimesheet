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
var flash=require("connect-flash");
router.use(flash());

router.get('/', function (req, res) {
    res.render('index.ejs');
});

router.get('/emplogin', function (req, res) {
    res.render('emplogin.ejs', {message: req.flash('loginMessage')});
});

// router.post('/empcreate', function(req, res) {
//     // attach POST to user schema
//     var user = new Employee({ email: req.body.email, password: req.body.password, name: req.body.name });
//     // save in Mongo
//     user.save(function(err) {
//         if(err) {
//             console.log(err);
//         } else {
//             console.log('user: ' + user.email + " saved.");
//             req.login(user, function(err) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 return res.redirect('/empcreated');
//             });
//         }
//     });
// });



passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Employee.findById(id, function (err, user) {
        done(err, user);
    });
});



// passport.use('local-login', new LocalStrategy({
//         // by default, local strategy uses username and password, we will override with email
//         usernameField: 'email',
//         passwordField: 'password',
//         passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
//     },
//     function (req, email, password, done) {
//         if (email)
//             email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
//
//         // asynchronous
//         process.nextTick(function () {
//             Employee.findOne({'email': email},{'password': password}, function (err) {
//                 // if there are any errors, return the error
//                 if (err)
//                     return done(err);
//
//                 // if no user is found, return the message
//                 if (!email)
//                     return done(null, false, req.flash('loginMessage', 'No user found.'));
//
//                 if (!password)
//                     return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
//
//                 // all is well, return user
//                 else
//                     return done(null);
//             });
//         });
//
//     }));



// ************************************************************************NEW ONE ***********************************

router.post('/empcreate', function(req, res){

    var newUser = new Employee({
            name: req.body.name,
            email:req.body.email,
            password: req.body.password
        });
    Employee.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });
    res.redirect('/empcreated');

});

passport.use('local',new LocalStrategy(
    function(name, password, email, done) {
        Employee.getEmployeeByemail(email, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
        Employee.getEmployeeBypassword(password, function (err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {message: 'Wrong User'});
                }
            });
        });
    }));


router.post('/emplogin', passport.authenticate('local', {
    successRedirect: '/dashboard', // redirect to the secure profile section
    failureRedirect: '/emplogin', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

router.get('/dashboard', function (req,res) {
    res.render('dashboard.ejs');
});



//Saving the Employer Time sheet and success ******************
router.post('/timesaved',function (req,res) {
    res.render('thankyou.ejs',{message:req.flash('page not found')});
});






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