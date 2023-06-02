const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const app = express();

// Body parser for our JSON data
app.use(express.json());

// Cross origin
const cors = require('cors');
app.use(cors({ origin: true }));
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Firebase Credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Api Endpoints
const userRoute = require('./routes/user');
app.use('/api/user', userRoute);

const productRoute = require('./routes/products');
app.use('/api/products', productRoute);

exports.app = functions.https.onRequest(app);
