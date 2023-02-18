
const mongoose = require('mongoose')
const validator = require('validator')

var UserSchema =new mongoose.Schema({
        userName:{
            type: String,
            require: true,
            minlength : 1,
            trim : true, 
        },
        firstName:{
            type: String,
            require: true,
            minlength : 1,
            trim : true,
        },
        lastName:{
            type: String,
            require: true,
            minlength : 1,
            trim : true,
        },
        email : {
            type: String,
            require: true,
            minlength : 1,
            trim : true,
            unique : true,
            validate : {
                validator : validator.isEmail ,
                message : '{value} is not a valid email'
            }
        },
        password:{
            type: String ,
            require : true , 
            minlength : 1 
        },
        tokens : [{
            token : {
               type: String,
               required : true 
            }
       }]
    }
)



var User =mongoose.model('Users', UserSchema )

module.exports = User 