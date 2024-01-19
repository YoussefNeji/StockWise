const express = require('express');
const app = express.Router();

const product = require('../models/productSchema');
const history = require('../models/historySchema');
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

app.post('/new', async (req, res) => {
    try {
        const newProduct = new product(req.body);

        const result = await newProduct.save();

        const historyProduct = new history();
        historyProduct.productId = result.id;
        historyProduct.nb_Befor_Update = result.nbStock;
        historyProduct.nb_After_Update = result.nbStock;
        historyProduct.dateUpdate = Date.now();
        await historyProduct.save();
        res.status(201).json(result);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

app.delete('/:id',authenticateToken, (req, res) => { 
    product.findByIdAndDelete(req.params.id).then((product) => {
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);



    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.patch('/api/product/:id',authenticateToken, async (req, res) => {
    try {
        const existingProduct = await product.findById(req.params.id);

        if (!existingProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        const updatedProduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedProduct) {
            return res.status(500).send({ error: 'Failed to update product' });
        }

        const historyProductUpdate = new history();
        historyProductUpdate.productId = updatedProduct.id;
        historyProductUpdate.nb_Before_Update = existingProduct.nbStock;
        historyProductUpdate.nb_After_Update = updatedProduct.nbStock;
        historyProductUpdate.dateUpdate = Date.now();

        await historyProductUpdate.save();

        res.send(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});
module.exports = app