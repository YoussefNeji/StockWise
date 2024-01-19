const mongoose = require ("mongoose");


const historySchema =new mongoose.Schema({

    productId :String,
    nb_Befor_Update:Number,
    nb_After_Update:Number,
    dateUpdate : Date,
});

const History = mongoose.model('history', historySchema);

module.exports = History;