require('dotenv').config();
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors=require('cors')

var index = require('./routes/index');
var blogs = require('./routes/blogs')
var auth = require('./routes/auth')
// var port = process.env.PORT || 3000 ;
var app = express();

var {configLoader} = require('./config/config')

configLoader().then((envData)=>{

    app.set('views',path.join(__dirname,'views'));
    app.set('view engine','ejs')
    app.engine('html',require('ejs').renderFile);

    app.use(express.static(path.join(__dirname,'client')))
    app.use(cors())

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended:false}));

    
    app.use('/blogs',blogs);
    app.use('/user',auth);
    app.use('/**',index);

    app.listen(envData.port,function(){
        console.log(`Environment: ${envData.env}`)
        console.log(`Server Started : ${envData.port}`);
})
})

