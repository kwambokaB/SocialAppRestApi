const route =  require('express').Router()
const Post = require('../models/postModel')
const User = require('../models/userModel')

// create a post
route.post("/create", async( req, res)=>{
    try{
     const newPost = new Post(req.body)
     const savedPost = await newPost.save()
     res.status(200).json(savedPost)
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

// update a post
route.put("/:id", async( req, res)=>{
    try{
      const post = await Post.findById(req.params.id)
      if(!post){
          return res.status(404).json("Post not found")
      }
      else if(post.userId !== req.body.userId){
         res.status(403).json("You can only update your post")
      } else{
         await post.updateOne({$set:req.body})
         res.status(200).json("Post has been updated")
      }
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

// delete a post
route.delete("/:id", async( req, res)=>{
    try{
      const post = await Post.findById(req.params.id)
      if(!post){
          return res.status(404).json("Post not found")
      }
      else if(post.userId !== req.body.userId){
         res.status(403).json("You can only delete your post")
      } else{
         await post.deleteOne();
         res.status(200).json("Post has been deleted")
      }
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

//like a post 
route.put("/:id/like", async( req, res)=>{
    try{
      const post = await Post.findById(req.params.id)
      if(!post.likes.includes(req.body.userId)){
         await post.updateOne({$push: {likes: req.body.userId}})
         res.status(200).json("The post has been liked")
      } else{
          await post.updateOne({$pull: {likes: req.body.userId}})
          res.status(200).json("The post has been unliked")
      }
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

// get a post
route.get("/post/:id", async( req, res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})

//get timeline posts
route.post("/timeline", async( req, res)=>{
    try{
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId: currentUser._id})
        const friendsPosts  = await Promise.all(
            currentUser.following.map(friendId =>  {
                return Post.find({userId: friendId})
            })
            )
        res.json(userPosts.concat(...friendsPosts))
    } catch (err){
        console.log(err)
        res.status(500).json(err)
    }
})


module.exports = route