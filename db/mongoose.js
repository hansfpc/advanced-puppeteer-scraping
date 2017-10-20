const config = require('../config');
const mongoose = require('mongoose');


const MongoDatabase = process.env.MONGO_DB;

mongoose.Promise = global.Promise;
if(config.env == 'development' || config.env == 'test'){
	mongoose.connect(MongoDatabase);
}else{
	mongoose.connect(MongoDatabase,{ useMongoClient: true });
}

module.exports = { mongoose };