const express = require('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoute = require('./src/routes/users')
const authRoute = require('./src/routes/auth')
const postRoute = require('./src/routes/posts')

const app = express()
dotenv.config()
const port = process.env.port

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(helmet())
app.use(morgan("common"))
app.use("/api/v1/users", userRoute)
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/posts", postRoute)

app.get('/', (req, res) => {
    res.send("Welcome to this awesome Api")
})

mongoose.connect(
    process.env.DB_URL, 
     {useUnifiedTopology: true, useNewUrlParser: true}, 
    () => {console.log('Connected to MongoDB database')}
    );

app.listen(port, ()=>{
    console.log(`Backend server running on port ${port}`)
})