/**
 * Created by srina on 2/23/2017.
 */
// load the things we need
var mongoose = require('mongoose');

// var bcrypt   = require('bcryptjs');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://sreenath:sreenath@ds145355.mlab.com:45355/hyr_users');
// var db = mongoose.connection;

var employeeSchema = mongoose.Schema({

        name      : String,
        email        : String,
        password     : String

});

var Employee = module.exports = mongoose.model('Employee', employeeSchema);

 module.exports.createUser = function(newUser,callback){
        // var query = {password: password, email: email,name:name};
       //  Employee.findOne(query, callback);
        // newUser.name = name;
        // newUser.email = email;
        // newUser.password = password;
        newUser.save(callback);
    }
// //
    module.exports.getEmployeeByname = function(name, callback){
        var query = {name: name};
    Employee.findOne(query, callback);

}
module.exports.getEmployeeByemail = function(email, callback){
    var query = {email: email};
    Employee.findOne(query, callback);

}
module.exports.getEmployeeBypassword = function(password, callback){
    var query = {password: password};
    Employee.findOne(query, callback);

}

//     module.exports.getUserBypassword = function(password, callback){
//     var query = {password: password};
//     Employee.findOne(query, callback);
//
// }
// //

module.exports.getEmployeeById = function(id, callback){
    Employee.findById(id, callback);
}



//
// module.exports.comparePassword = function(candidatePassword, hash, callback){
//     bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//         if(err) throw err;
//         callback(null, isMatch);
//     });
// }




// employeeSchema.methods.generateHash = function(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };
//
// // checking if password is valid
// employeeSchema.methods.validPassword = function(password) {
//     return bcrypt.compareSync(password, this.emplocal.password);
// };




