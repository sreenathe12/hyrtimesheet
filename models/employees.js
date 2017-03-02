/**
 * Created by srina on 2/23/2017.
 */
// load the things we need
var mongoose = require('mongoose');
var EmployeeSchema = mongoose.Schema({

        name      : {type:String} ,
        email        : {type:String},
        password     : {type:String}

});

var Employee = module.exports = mongoose.model('Employee', EmployeeSchema);

// module.exports.findEmployeeByemail = function (email,callback) {
//     var query = {email: email};
//     Employee.findOne(query, callback);
// };
 module.exports.createUser = function(newUser,callback){
               newUser.save(callback);
    };


