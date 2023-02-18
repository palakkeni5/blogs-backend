var mongoose = require('mongoose')

var CommentSchema = new mongoose.Schema({

    text:String,
    author_name : String
},{
    timestamps : {
        createdAt: 'created_at'
    }  
});
module.exports = mongoose.model('Comment',CommentSchema);