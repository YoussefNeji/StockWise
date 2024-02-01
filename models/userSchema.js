const mongoose = require ("mongoose");

const userSchema =new mongoose.Schema({

    fullName :String,
    Email :String,
    Password :String,
    adress:String,
    city:String,
    country:String,
    postcode:String,
    Aboutme : String,
    isAdmin : Boolean,
});

const User = mongoose.model('user', userSchema);

module.exports = User;