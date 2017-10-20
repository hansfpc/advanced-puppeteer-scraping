require('./config');

const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Propertie } = require('./api/models/propertieModel');

const app = express();
const port = process.env.PORT;
const mongodb = process.env.MONGO_DB;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 


/*app.use(function(req, res, next) {
  var allowedOrigins = ['http://localhost:6000', 'http://localhost:3000'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});*/
const routes = require('./api/routes/propertieRoutes');
routes(app); //register the route


app.listen(port, () => {
  console.log('************************************************');
  console.log(`APP Asset with API server started on port: ${port}`);
  console.log(`APP Asset run MONGODB: ${mongodb}`);
  console.log('************************************************');
});

module.exports.app = app; 