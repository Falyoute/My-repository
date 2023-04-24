const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./Routes/AuthRoutes');
const cookieParser = require('cookie-parser');

//Express app
const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Connexion à la base de données MongoDB
const dbURI = "mongodb+srv://zak:zak123@cluster0.nydtlpg.mongodb.net/auth";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log('connexion réussie'))
  .catch(err => console.log(err));

//Ecouter les requetes 
app.listen(3000);


//Importer les routes
app.use(authRoutes);
