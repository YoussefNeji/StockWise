const express = require('express');
const app = express.Router();
const History = require('../models/historySchema');
const Product =require('../models/productSchema');

app.get('/get/:createdBy', async (req, res) => {
    try {
        console.log("the created by = ",req.params.createdBy);
        const userProducts = await Product.find({createdBy:req.params.createdBy});
        const productIds = userProducts.map(product => product._id);
        const historyEntries = await History.find({ productId: { $in: productIds } });      
          console.log("this ",historyEntries);
        res.status(200).json(historyEntries);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
  });


module.exports = app