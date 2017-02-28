/**
 * Created by srina on 2/27/2017.
 */
var express  = require('express');
var path = require('path');
var app      = express();
var mongoose = require('mongoose');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var ejs = require('ejs');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://chandra:chandra@ds157509.mlab.com:57509/hyremployee');
// mongoose.connect('mongodb://sreenath:sreenath@ds145355.mlab.com:45355/hyr_users');
var db = mongoose.connection;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash    = require('connect-flash');
var port     = process.env.PORT || 4000;


var morgan       = require('morgan');
app.use(morgan('dev')); // log every request to the console

app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("static"));

app.use(session({
    secret: 'sreenathchandra', // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use('/', require('./routes/router'));
app.use('/', require('./routes/routeremp'));



app.listen(port);
console.log('The magic happens on port ' + port);




