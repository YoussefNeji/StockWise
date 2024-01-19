const express = require('express');
const app = express.Router();
const user = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const Crypter = require('cryptr');
const cryptr = new Crypter('myTotalySecretKey');


const ACCESS_TOKEN_SECRET="abc123";
const REFRESH_TOKEN_SECRET="efg456";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) return next(err); // Call next with the error
        req.user = user;
        next();
    });
  }


app.post('/register', async (req, res) => {
    try {

        const encryptedPWD = cryptr.encrypt(req.body.Password);
        console.log(encryptedPWD);
        

        const newuser = new user({
            fullName: req.body.fullName,
            Email: req.body.Email,
            Password: encryptedPWD,
            Location: req.body.Location,
            Aboutme: req.body.Aboutme
        });      
        const result = await newuser.save();
        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/user/:id',authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await user.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedUser) {
            return res.status(500).send({ error: 'Failed to update user' });
        }
        console.log("Updated User : ", updatedUser);
        res.send(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
    
        const NewUser =await user.find({ Email : req.body.Email  });
        
        if (NewUser.length < 1)
        {
          res.json({ status: "err", message: 'Email Does not Exists' });
          return ;
        }
        const decryptedString = cryptr.decrypt(NewUser[0].Password);
        if (decryptedString !== req.body.Password )
        {
          res.json({ status: "err", message: 'Wrong Paswword' });
          return ;
        }

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = app