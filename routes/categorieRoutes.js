const express = require('express');
const app = express.Router();
const categories = require('../models/categoriesSchema');
const jwt = require('jsonwebtoken');
const Product = require('../models/productSchema');
 
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

app.post('/createCategories',async (req, res) => {
    try {
        const newcategories = new categories(req.body);

        const result = await newcategories.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

app.patch('/updateCategoryName/:categorieName', async (req, res) => {
    try {
      const oldCategorieName = req.params.categorieName;
      const newCategorieName = req.body.categorieName;
      const updatedCategory = await categories.findOneAndUpdate(
        { categorieName: oldCategorieName },
        { $set: { categorieName: newCategorieName } },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

app.delete('/removeCategory/:categorieName', async (req, res) => {
    try {
      const categorieName = req.params.categorieName;
      const result = await categories.findOneAndDelete({ categorieName });
      if (!result) {
        return res.status(404).json({ error: 'Category not found' });
      }
      console.log("this is the categorieName = ",categorieName),
      await Product.deleteMany({ categorieName });
      res.status(200).json({ message: 'Category and associated products removed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.get('/getallcategories/:createdBy', async (req, res) => {
    try {
        const createdBy = req.params.createdBy;
        if (!createdBy) {
            return res.status(400).json({ error: 'Missing createdBy parameter' });
        }

        const categoriesByCreatedBy = await categories.find({ createdBy });
        res.status(200).json(categoriesByCreatedBy);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/updateCategoryNumber/:createdBy', async (req, res) => {
  try {
    const categoriesfound = await Product.aggregate([
      { $match: { createdBy: req.params.createdBy } },
      { $group: { _id: "$categorieName", count: { $sum: 1 } } }
    ]);

    for (let i= 0 ; i< categoriesfound.length;i++){
      const categoryName = categoriesfound[i]._id;
      const productCount = categoriesfound[i].count;

    await categories.findOneAndUpdate(
        { categorieName: categoryName },
        { $set: { productOnIt: productCount } },
        { new: true }
      );
    }


    res.status(200).json({ message: 'Category numbers updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = app