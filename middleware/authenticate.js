var {User} = require("../models/users")
const { JWT_KEY  } =require('../config/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateAuthToken = (user)=>{
    return jwt.sign({
        email: user.email,
        userId : user.userName
    },JWT_KEY,{
        expiresIn: "1h"
    })
}



const authenticate = (req, res , next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1] ;
        const decoded = jwt.verify(token , JWT_KEY )
        req.userToken = decoded
        next()
    }catch(error){
        return res.status(401).json({
            message:"Auth failed"
        })

    }
}

module.exports = {
    authenticate,
    generateAuthToken,
}