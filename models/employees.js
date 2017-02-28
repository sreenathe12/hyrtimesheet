/**
 * Created by srina on 2/23/2017.
 */
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://sreenath:sreenath@ds145355.mlab.com:45355/hyr_users');
// var db = mongoose.connection;

var employeeSchema = mongoose.Schema({
    emplocal            :
        {
        empname      : String,
        email        : String,
        password     : String
    }

});

var Employee = module.exports = mongoose.model('Employee', employeeSchema);

//  module.exports.createUser = function(newEmployee, callback){
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash(newEmployee.emplocal.emppassword, salt, function(err, hash) {
//             newEmployee.emplocal.emppassword = hash;
//             newEmployee.save(callback);
//         });
//     });
// }
//
// module.exports.getUserByUsername = function(username, callback){
//     var query = {username: username};
//     User.findOne(query, callback);
// }
//
// module.exports.getUserById = function(id, callback){
//     User.findById(id, callback);
// }
//
// module.exports.comparePassword = function(candidatePassword, hash, callback){
//     bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//         if(err) throw err;
//         callback(null, isMatch);
//     });
// }




employeeSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
employeeSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.emplocal.password);
};




