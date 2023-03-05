const mongoose = require("mongoose")

var schema=new mongoose.Schema({
    username1:{
        type:String,
        required:true
    },
    username2:{
        type:String,
        required:true
    }
})

const history=mongoose.model('history', schema)
module.exports=history