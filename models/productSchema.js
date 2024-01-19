const mongoose = require ("mongoose");

const productSchema =new mongoose.Schema({

    productName : String,
    Prix :Number,
    nbStock :Number,
    dateEntre : Date,
    idCategories: String,
    
});

const Product = mongoose.model('product', productSchema);

module.exports = Product;