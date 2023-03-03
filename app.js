const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bodyparser = require("body-parser")
const path = require("path")

const app = express()

dotenv.config({path:'config.env'})
const PORT=process.env.PORT || 8080

app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine","html")
// app.set("views", path.resolve(__dirname, "views"))

app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

const uri="mongodb+srv://rohitphalke:mongodb@rdb.1atq6vo.mongodb.net/?retryWrites=true&w=majority"

async function connect(){
    try{
        await mongoose.connect(uri)
        console.log("Connected to database.")
    } catch(error){
        console.log(error)
    }
}
connect()

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.listen(PORT, ()=>{
    console.log(`Site hosted on port ${PORT}.`)
})