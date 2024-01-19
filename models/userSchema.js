const mongoose = require ("mongoose");

const userSchema =new mongoose.Schema({

    fullName :String,
    Email :String,
    Password :String,
    Location :String,
    Aboutme : String,

});

const User = mongoose.model('user', userSchema);

module.exports = User;