const express = require('express');

const { user } = require('./src/models');
const app = express.Router();

app.use(express.json());
function authenticateToken(req, res, next) {
   
    next()
}

app.get('/user/:id',authenticateToken, async (req, res) => {
    try {
        const id = req.params.id;
        const user = await user.findById(id);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Internal server error' });
    }
});
module.exports = app