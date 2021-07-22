const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: "https://image.shutterstock.com/image-vector/blue-avatar-placeholder-icon-design-260nw-1998700790.jpg"
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        max: 250
    },
    city: {
        type:String,
        max: 50
    },
    from: {
        type:String,
        max: 50
    },
    relationship: {
        type:Number,
        enum: [1,2,3]
    }
},
   {timestamps: true}
)

module.exports = mongoose.model("User", userSchema)