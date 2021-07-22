const route = require("express").Router();
const bcrypt =  require('bcrypt')
const User = require('../models/userModel')

route.get("/", (req, res)=> {
    res.send("Welcome to users route")
})

// update user
route.put("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
       if(req.body.password){
           try{
               const salt = await bcrypt.genSalt(10)
               req.body.password = await bcrypt.hash(req.body.password, salt)
           }catch(err) {
               console.log(err)
               res.status(500).json(err)
           }
           
       }
       try{
        const user = await User.findByIdAndUpdate(req.params.id, {$set : req.body})
        res.status(200).json("Account has been updated")
    }
    catch (err) {
     console.log(err)
     res.status(500).json(err)
    }
    }
    return res.status(403).json("You can only update your owm account!")
})

//delete user
route.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
       try{
        const user = await User.deleteOne({_id: req.params.id})
        
        res.status(200).json("Account has been deleted")
    }
    catch (err) {
     console.log(err)
     res.status(500).json(err)
    }
    }
    return res.status(403).json("You can only delete your owm account!")
})

//get a user
route.get("/:id", async (req, res) => {
  try{
   const user = await User.findById(req.params.id);
   const {password, updaatedAt, ...other} = user._doc
   res.status(200).json(other)
  }
  catch (err){
    console.log(err)
    res.status(500).json(err)
  }
})

// follow user
route.put("/:id/follow", async (req, res) => {
    if(req.body.userId === req.params.id){
        return res.status(403).json("You can't follow / unfollow  yourself")
    }
    try{
     const userToFollow = await User.findById(req.params.id)
     const currentUser = await User.findById(req.body.userId)
     if(!userToFollow.followers.includes(req.body.userId)){
         await userToFollow.updateOne({$push: {followers: req.body.userId}})
         await currentUser.updateOne({$push: {following: req.params.id}})
         return res.status(200).json("User has been followed successfully")
     } else {
         await userToFollow.updateOne({$pull: {followers: req.body.userId}})
         await currentUser.updateOne({$pull : {following: req.params.id}})
         return res.status(200).json("User has been unfollowed successfully")
     }

    } catch (err){
    console.log(err)
    res.status(500).json(err)
  }
})



module.exports = route

