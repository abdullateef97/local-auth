/**
 * Created by belle on 5/24/17.
 */
'use strict';
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userSchema = mongoose.Schema({
    name : String,
    username : {
        type:String,
        index:true
    },
    email :String,
    password : String
});

let User = module.exports = mongoose.model('User',userSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function (err,salt) {
        bcrypt.hash(newUser.password, salt ,function (err,hash) {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
};
module.exports.getUserByUsername = function(username , callback){
    let query = {username : username};
    User.findOne(query,callback);
};
module.exports.getUserById = function(id , callback){
    User.findById(id,callback);
};
module.exports.comparePassword = function (candPass, hash , callback) {
    bcrypt.compare(candPass, hash, (err, isMatch)=>{
        if(err) throw err;
        callback(null, isMatch)
    })
}