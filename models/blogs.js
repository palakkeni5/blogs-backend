var mongoose = require('mongoose')

var BlogSchema = new mongoose.Schema({
    author_name:{
        ref : 'Users',
        type: String,
        require: true,
        minlength : 1,
        trim : true,
    },
    title:{
        type: String,
        require: true,
        minlength : 1,
        trim : true,
    },
    blog : {
        type: String,
        require: true,
        minlength : 1,
        trim : true,
    },
    tags : [{
        type: String,
        require: true,
        minlength : 1,
        trim : true,
    }],
    comments : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
},{
    timestamps : {
        createdAt: 'created_at'
    }  
});
module.exports = mongoose.model('Blog',BlogSchema);
