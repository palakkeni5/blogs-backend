var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs')


var User = require('../models/users')
var {generateAuthToken , authenticate} =require('../middleware/authenticate')


//-----------------------------
//REGISTER ROUTES
//----------------------------

router.post('/register', (req, res) =>{

    if(req.body.userName == undefined || 
        req.body.firstName == undefined || 
        req.body.lastName == undefined || 
        req.body.email == undefined ||  
        req.body.password == undefined      
        ){
        return res.status(401).json({"message":"unauthorized request"})
    }

    User.find( { "$or":[{ "email": req.body.email} , {"userName":req.body.username}] } ).then((user)=>{
        
        if(user.length>0){
            return res.status(400).json({"message":"user with this name and email already exists"})
        }
    }).then(()=>{
        bcrypt.hash(req.body.password, 10 , (err,hash)=>{
            if(err){
                return res.status(500).json({error:err})
            }else{
                var user = new User({
                    userName: req.body.userName,
                    firstName: req.body.firstName,
                    lastName : req.body.lastName,     
                    email : req.body.email,
                    password :hash,
                })
                user.save().then((data)=>{
                    console.log(data)
                    return res.json(data)
                },(err)=>{
                    return res.status(400).json(err)
                })
            }
        })
    })
    
})





//-----------------------------
//REGISTER ROUTES
//----------------------------


//--------------------------------
//SIGN IN ROUTES
//-------------------------------

router.post("/login",(req, res , next)=>{
    if(req.body.email == undefined ||  
        req.body.password == undefined ){
        return res.status(401).json({"message":"unauthorized request"})
    }

    User.findOne( {email : req.body.email })
        .exec()
        .then(user =>{
            bcrypt.compare(req.body.password , user.password,(err, response)=>{
                if(err || response == false ){
                    return res.status(401).json({
                        "message":"Auth failed 2"
                    })
                }else{
                    const token = generateAuthToken(user)

                    return res.status(200).json({
                        "message":"Auth successful",
                        userName: user.userName ,
                        firstName : user.firstName ,
                        lastName : user.lastName ,
                        email : user.email ,
                        token: "Bearer " +token,
                        _id : user._id
                    })                    
                }
            })     
        }).catch((err)=>{
            return res.status(401).json({
                "message":"Auth failed 1"
            })
        })

})

//--------------------------------
//SIGN IN ROUTES
//-------------------------------


//---------------------------------
// PUT ROUTE
//--------------------------------
 router.post('/user-info', authenticate , (req, res) =>{

    if( req.body == undefined || req.body.email == undefined    
        ){
        return res.status(401).json({"message":"unauthorized request"})
    }
    var updateData = {};

    if(req.body && req.body.dateOfBirth){
        updateData.dateOfBirth = req.body.dateOfBirth
    }

    if(req.body && req.body.addictionCategory){
        updateData.addictionCategory = req.body.addictionCategory
    }
   
    if(updateData === {}){
        return res.status(404).json(err)
    }


    User.findOneAndUpdate( { email : req.body.email },
                           { $set : updateData },
                           {new : true},
                           (err , doc) =>{

        if(doc == null || doc == undefined || err){
            console.log(err)
            return res.status(404).json(err)
        }else{
            return res.json(doc)
        }            

    } )       
   
    
})
module.exports = router;