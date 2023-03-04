const mongoose = require("mongoose")

var schema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    whom:{
        type:String,
        required:true
    }
    // emojis:{
    //     type:String,
    //     required:true
    // },
    // reply:{
    //     type:String,
    //     required:true
    // },
    // work_live:{
    //     type:String,
    //     required:true
    // },
    // friend:{
    //     type:String,
    //     required:true
    // },
    // insta_net:{
    //     type:String,
    //     required:true
    // },
    // bird_owl:{
    //     type:String,
    //     required:true
    // },
    // pet:{
    //     type:String,
    //     required:true
    // },
    // travel:{
    //     type:String,
    //     required:true
    // },
    // relationship:{
    //     type:String,
    //     required:true
    // },
    // sunday:{
    //     type:String,
    //     required:true
    // },
    // movie_serial_tv:{
    //     type:String,
    //     required:true
    // },
    // party:{
    //     type:String,
    //     required:true
    // },
    // tattoo:{
    //     type:String,
    //     required:true
    // },
    // music:{
    //     type:String,
    //     required:true
    // },
    // employment:{
    //     type:String,
    //     required:true
    // }
})

const question=mongoose.model('question', schema)
module.exports=question