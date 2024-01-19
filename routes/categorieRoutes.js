const express = require('express');
const app = express.Router();
const categories = require('../models/categoriesSchema');
const jwt = require('jsonwebtoken');


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

app.post('Categories', authenticateToken,async (req, res) => {
    try {
        const newcategories = new categories(req.body);
        const result = await newcategories.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

app.patch('Categories/:id',authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedCategories = await Categories.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCategories) {
            return res.status(500).send({ error: 'Failed to update Categories' });
        }
        console.log("Updated Categories : ", updatedCategories);
        res.send(updatedCategories);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.delete('categories/:id',authenticateToken, (req, res) => {
    categories.findByIdAndDelete(req.params.id).then((categories) => {
        if (!categories) {
            return res.status(404).send();
        }
        res.send(product);
    }).catch((error) => {
        res.status(500).send(error);
    });
});
module.exports = app