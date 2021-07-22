const route = require("express").Router();
const User = require('../models/userModel.js')
const bcrypt = require('bcrypt');

route.get("/", (req, res)=> {
    res.send("Welcome to auth route")
})

route.post("/register", async (req, res)=> {
    try{
     const salt  = await bcrypt.genSalt(10);
     const hashedPassword = await bcrypt.hash(req.body.password, salt)   
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
     const savedUser = await newUser.save()
     res.send(savedUser).json(savedUser)
}
catch (e) {
    console.log("[error saving new user]", e)
    res.status(500).json(e)
}
})

route.post("/login", async (req, res)=> {
    try{
    const user = await User.findOne({email: req.body.email})
    console.log('[user]', user)
    if(user){
      const validPassword = await bcrypt.compare(req.body.password, user.password)
       if(validPassword){
           res.status(200).json(user)
       }else{
           res.status(400).json("User password not valid")
       }
     }else{
        res.status(404).json("User with email not found")
     }
     }
catch (e) {
    console.log("[error logging in]", e)
    res.status(500).json(e)
           }

})

module.exports = route