const mongoose = require ("mongoose");


const historySchema =new mongoose.Schema({

    productId :String,
    productName:String,
    old_prix:Number,
    new_prix:Number,
    oldnbStock:Number,
    newnbStock: Number,
    dateUpdate : Date,
});

const History = mongoose.model('history', historySchema);

module.exports = History;