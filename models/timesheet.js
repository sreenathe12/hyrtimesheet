/**
 * Created by srina on 2/24/2017.
 */
var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');
var timeSchema = mongoose.Schema({
    timelocal : {
        name : String,
        startdate : Date,
        enddate : Date,
        hours:Number,
    }
});
module.exports = mongoose.model('Time',timeSchema);
