const express = require("express")
const dotenv = require("dotenv")
const bodyparser = require("body-parser")
const path = require("path")
const app = express()

const connect=require('./server/database/connection')

dotenv.config({path:'config.env'})
const PORT=process.env.PORT || 8080

connect()
app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine","html")
// app.set("views", path.resolve(__dirname, "views"))

app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

var user=require(__dirname+"/server/model/user")

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.post('/register',(req,res)=>{
    const user_data=new user({
        name:req.body.name,
        username:req.body.username,
        location:req.body.location,
        contact:req.body.contact,
        email:req.body.email,
        password:req.body.password
    })
    user_data.save()
    res.send(user_data)
})

app.listen(PORT, ()=>{
    console.log(`Site hosted on port ${PORT}.`)
})