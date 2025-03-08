const mongoose = require('mongoose')

mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    mobileno : String,
    username : String,
    password : String
})

module.exports = mongoose.model("user",userSchema)