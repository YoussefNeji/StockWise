const mongoose = require ("mongoose");

const productSchema =new mongoose.Schema({
    // _id:String,
    productName : String,
    Prix :Number,
    nbStock :Number,
    categorieName: String,
    createdBy:String,
    
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;