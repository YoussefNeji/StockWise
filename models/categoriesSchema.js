const mongoose = require ("mongoose");

const categoriesSchema =new mongoose.Schema({

    categorieName :String,
    productOnIt:Number,
    createdBy:String,
    dateC:Date,
});

const categories = mongoose.model('categories', categoriesSchema);

module.exports = categories;