const express = require('express');
const app = express.Router();
const user = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const Crypter = require('cryptr');
const cryptr = new Crypter('myTotalySecretKey');
 

const ACCESS_TOKEN_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWIxMGQ3NTgxNjc3NTEzNDAyNTc2OGEiLCJpYXQiOjE3MDYyOTM2OTYsImV4cCI6MTcwNjI5NzI5Nn0.1hdzkz4c4_wC83hUJQ4N7AWnD6aVhU0n0PQEQ7riOmo";

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401).json({ error: 'Access denied' });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}


app.post('/register', async (req, res) => {
  try {
    const encryptedPWD = cryptr.encrypt(req.body.Password);

    const emailExists = await user.findOne({ Email: req.body.Email });
    if (emailExists) {
      return res.send("emailExistss");
    }

    if (req.body.Password!==req.body.Password2){
      return res.send("passwordmatch");
    }

    const newuser = new user({
      fullName: req.body.fullName,
      Email: req.body.Email,
      Password: encryptedPWD,
      isAdmin : Boolean,
    });

    const result = await newuser.save();
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.patch('/update/:email', authenticateToken, async (req, res) => {
  try {
      const email = req.params.email;
      const updatedUser = await user.findOneAndUpdate({ Email: email }, req.body, { new: true });

      if (!updatedUser) {
          return res.status(500).send({ error: 'Failed to update user' });
      }

      console.log("Updated User:", updatedUser);
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
         res.json({status:"err" , message: 'Email Does not Exists'});
          return ;
        }
        const decryptedString = cryptr.decrypt(NewUser[0].Password);
        if (decryptedString !== req.body.Password )
        {
         res.json({status:"err" , message: 'Wrong Paswword'});
          return ;
        }

        const token = jwt.sign({ userId: NewUser[0]._id }, ACCESS_TOKEN_SECRET, {
          expiresIn: '1h',
        });
        res.json({status:"ok", token });
        
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

app.get('/getOneInfo', async (req, res) => {
  try {
      const existingUser = await user.findOne({ Email: req.query.Email });

      if (!existingUser) {
          return res.status(404).send({ error: 'User not found', message: 'User with the specified email does not exist' });
      }

      res.send(existingUser);
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Internal server error' });
  }
});


module.exports = app