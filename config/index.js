const env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  process.env.PORT = '3000'
  process.env.MONGO_DB = 'mongodb://localhost/AssetDevelopment';
  process.env.INTERVAL_AGUASANDINAS = 10000;
  process.env.INTERVAL_ENEL = 10000;

} else if (env == 'test') {
  process.env.PORT = '4000'
  process.env.MONGO_DB = 'mongodb://localhost/AssetTest';
  process.env.INTERVAL_AGUASANDINAS = 1000;
  process.env.INTERVAL_ENEL = 1000;
}else{
  process.env.PORT = '5000'
  process.env.MONGO_DB = 'mongodb://localhost/Asset';
  process.env.INTERVAL_AGUASANDINAS = 30000;
  process.env.INTERVAL_ENEL = 30000;
}

module.exports.env = env; //for testing
module.exports.intervalAguasAndinas = process.env.INTERVAL_AGUASANDINAS || 10000; 
module.exports.intervalEnel = process.env.INTERVAL_ENEL || 10000; 

