const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/products', productRoutes);

mongoose.connect('mongodb://localhost:27017/Stock_Mangement_Db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(3000, () => {
  console.log(`Server is listening at http://localhost:3000`);
});
