const express = require('express');
const app = express.Router();

const product = require('../models/productSchema');
const history = require('../models/historySchema');
const categorie = require('../models/categoriesSchema');
const jwt = require('jsonwebtoken');

app.use(express.json());
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  app.post('/createproduct/:name', async (req, res) => {
    try {
      const newProduct = new product();
      newProduct.productName = req.body.productName;
      newProduct.Prix = req.body.Prix;
      newProduct.nbStock = req.body.nbStock;
      newProduct.categorieName = req.body.categorieName;
      newProduct.createdBy = req.params.name;
      const result = await newProduct.save();
      



      res.status(201).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.delete('/deleteProduct/:id', (req, res) => {
    product
      .findByIdAndDelete(req.params.id)
      .then((product) => {
        if (!product) {
          return res.status(404).send();
        }
        res.send(product);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  app.patch('/update/:id', async (req, res) => {
    try {
      const oldProductId = req.params.id;
      const updatedProduct = req.body;
  
      console.log(oldProductId);
      console.log(updatedProduct);

      const foundedproducts = await product.findOne({ _id : oldProductId});
      console.log("the founded prodect is ",foundedproducts);
      const ProductBeforUpdate = product.find({ _id: oldProductId });
      const updatedP = await product.findOneAndUpdate( 
        { _id: oldProductId },
        {
          $set: {
            productName: updatedProduct.productName,
            Prix: updatedProduct.Prix,
            nbStock: updatedProduct.nbStock,
            categorieName: updatedProduct.categorieName,
          },
        },
        { new: true }
      );

      const historyProduct = new history();
      historyProduct.productId = updatedP._id; // Assuming _id is the product ID
      historyProduct.productName = updatedP.productName;
      historyProduct.old_prix = ProductBeforUpdate.Prix; // Assuming Prix is the price
      historyProduct.new_prix = updatedProduct.Prix; // Assuming Prix is the price in updatedProduct
      historyProduct.oldnbStock = ProductBeforUpdate.nbStock;
      historyProduct.newnbStock = updatedProduct.nbStock;
      historyProduct.dateUpdate = Date.now();
      

      await historyProduct.save();

      if (!updatedP) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.status(200).json(updatedP);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  app.get('/getallproducts/:createdBy', async (req, res) => {
    try {
      const createdBy = req.params.createdBy;
      const foundedproducts = await product.find({createdBy : createdBy});
      res.status(200).json(foundedproducts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

module.exports = app