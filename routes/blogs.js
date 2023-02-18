var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users.js')
var Blog = require('../models/blogs.js')
var Comment = require('../models/comments.js')

const { authenticate }=require("../middleware/authenticate")

//GET ALL THE BLOGS
router.get('/',function(req,res,next){
    Blog.find({}, (err,allblogs) => {
        console.log(allblogs)
        if(err){
            return res.status(404).json(err)
        }
       
        return res.json(allblogs);
    })
})


//GET A SINGLE BLOG
router.get('/:id',function(req,res,next){
    Blog.findById(req.params.id).populate("comments").exec(function(err, blog){
		if(err || blog === undefined || blog === null){
            return res.status(404).json({err:"Blog Not found"})
		} else {
			return res.json(blog);
		}
	});
})


//CREATE BLOGS

router.post('/new-blog', authenticate ,function(req,res,next){
    console.log("inside new-blog")
    var blog = req.body;
    if(!blog.title || ! blog.blog || !blog.author_name ){
        return res.status(404).json("Error posting blog")
    }
    else{
        Blog.create(blog,function(err,blog){
            if(err){
                return res.status(404).json(err)
            }
            else{
                return res.json(blog);
            }
        })
    }

})

//Delete Blog
router.delete('/:id',authenticate,function(req,res,next){

    Blog.findById(req.params.id,function(err,foundblog){
        
        if( foundblog == null || 
            foundblog == undefined ||
            foundblog.author_name!== req.userToken.userId ){
            return res.status(404).json({msg:"Blog not found"})
        }else{
            Blog.findByIdAndRemove({_id:req.params.id},function(err,blog){
                if(err){
                    console.log(err)
                    return res.status(404).json(err)
                }
                else{
                    console.log(req.author_name)
                    return res.json(blog);
                }
            })
        }
    })
    
    
})

//Update Blog

router.put('/:id',authenticate,function(req,res,next){
    var blog = req.body;
    var upblog = {};

    if(blog && blog.title){
        upblog.title = blog.title;
    }
    if(blog && blog.blog){
        upblog.blog = blog.blog;
    }

    if(!upblog){
        return res.status(404).json({msg : "Incorrect Blog details"})
    }else{
        Blog.findByIdAndUpdate({_id:req.params.id},upblog,{},function(err,blog){
            
            if(blog == null || 
                blog == undefined ||
                err){
                return res.status(404).json({err:"Error in updating blog"})
            }else{
                return res.json(blog)
            }
        })
    }
    
})

//FOR ADDING COMMENTS TO A BLOG
router.post('/:id/comments',authenticate,function(req,res){
    Blog.findById(req.params.id,function(err,blog){
        // console.log('First comment ' + req.body)
        // console.log('First Blog ' + blog._id)
        if(blog == null || 
            blog == undefined ||err){
            console.log(err)
            return res.status(404).json(err)
        }else{

            var comment= new Comment({
                text: req.body.text,
                author_name : req.body.author_name
            })
            // console.log('this is real comment ' +comment.text+ ' '+ comment.author_name)
            comment.save().then((data)=>{
                console.log('data:'+data)
                console.log(data)
                blog.comments.splice(0,0,data._id)
                Blog.findOneAndUpdate({_id:blog._id},blog,{},function(err,data){
                    if(err){
                        return res.status(404).json(err)
                    }else{
                        return res.json(data)
                    }
                })
            },(err)=>{
                return res.status(400).json(err)
            })
            //console.log(blog)
        }
        
    })

})

//GET BLOGS BY  A TAG
router.get('/blogsByTag/:tagName', (req, res, next) => {
    Blog.find({
        tags: {
        $in: req.params['tagName']
        }
    }).then(response => {
        return res.status(200).json(response);
    }).catch(err => {
        return res.status(500).json(err);
    })
})

//GET TRENDING BLOGS
router.get('/trendingBlogs',function(req,res,next){
    Blog.find(function(err,blogs){
        return res.json(blogs);
    })
    .sort({'_id':-1}).limit(5)
    .catch((err)=>{
        console.log(err)
        return res.status(404).json(err)
    })

})

router.post('/userBlogs', authenticate,(req,res,next) => {
    console.log(req.body)
    if(req.body.author_name == undefined ){
        return res.status(401).json({"message":"unauthorized request"})
    }else{
        Blog.find({'author_name':req.body.author_name}).then((blogs)=>{
            return res.status(200).json(blogs)
        }).catch((err)=>{
            return res.status(404).json(err)
        })
    }
})



module.exports = router;