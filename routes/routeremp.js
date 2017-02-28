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

router.get('/', function (req, res) {
    res.render('index.ejs');
});

router.get('/emplogin', function (req, res) {
    res.render('emplogin.ejs', {message: req.flash('loginMessage')});
});

// router.post('/empcreate', function(req, res){
//     // var empname = req.body.empname;
//     // var empemail = req.body.empemail;
//     // var emppassword = req.body.emppassword;
//
//         var newEmployee = new Employee();
//           empname : req.body.empname;
//         empemail : req.body.empemail;
//         emppassword : req.body.emppassword;
//
//
//               Employee.createUser(newEmployee, function(err){
//                   if(err) throw err;
//
//               });
//         res.redirect('/empcreated');
//
// });

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Employee.findById(id, function (err, user) {
        done(err, user);
    });
});


router.post('/empcreate', passport.authenticate('local-signup', {
    successRedirect : '/empcreated', // redirect to the secure profile section
    failureRedirect : '/empcreate', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));


   passport.use('local-signup', new LocalStrategy({
        // empname : 'empname',
         usernameField :'email',
         passwordField : 'password',
       passReqToCallback : true
   },
    function (req,email,empname, password, done) {
        process.nextTick(function () {
            Employee.findOne({'emplocal.email':email},function (err,user) {
                if(err)
                    return done(err);
                // if(user) {
                //     return done(null, false, req.flash('signupMessage', 'That email alredy taken'));
                // }
                else {
                    var newUser = new Employee();
                    newUser.emplocal.empname = empname;
                    newUser.emplocal.empemail = email;
                  //   newUser.emplocal.emppassword = newUser.generateHash(password);;

                    newUser.save(function (err) {
                        if(err)
                            throw err;
                        return done(null,newUser);
                    })
                }
            })
        });
    }
));







module.exports = router;

