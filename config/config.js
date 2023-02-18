var mongoose = require('mongoose');

let configLoader = () => {
  // let configFileName;
  let env = process.env.NODE_ENV || 'development';
  let db = process.env.DB;
  let port = process.env.port || 3000
  mongoose.Promise=global.Promise;
  mongoose.connect( db , { useNewUrlParser: true } )

  return Promise.resolve({env,db,port});
};

module.exports={
    configLoader,
    JWT_KEY : process.env.JWT_KEY
  }