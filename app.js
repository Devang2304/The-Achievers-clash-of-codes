const express = require("express")
const dotenv = require("dotenv")
const bodyparser = require("body-parser")
const path = require("path")
const fs=require('fs')
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

app.get('/login',async (req, res)=>{
    res.sendFile(__dirname+'/views/login.html')
});

app.get('/register',async (req, res)=>{
    res.sendFile(__dirname+'/views/register.html')
});

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

const current_user_updater=async(result)=>{
    fs.writeFile('./server/controller/currentUser.json',JSON.stringify(result),err=>{
        if(err) console.log(err)
        else{
            return true
        }
    })
}

const current_user=async()=>{
    fs.readFile('./server/controller/currentUser.json','utf-8',(err,currentUserData)=>{
        if(err) console.log(err)
        else{
            try {
                var data=JSON.parse(currentUserData)
                return data
            } catch (err) {
                console.log('error', err);
            }
        }   
    })
}

const current_user_checker=async(data)=>{
    var path = __dirname+'/controller/currentUser.json'
    if(fs.existsSync(path)){
        return true
    }
    else{
        return false
    }
}

const user_finder=async(value1, value2)=>{
    try{
        const data=await user.find({$and: [{username: value1}, {password: value2}]});
        return data
    }catch(error){
        console.log(error.message)
    }
}

app.post('/login',async (req, res)=>{
    const result=await user_finder(req.body.username, req.body.password)
    if(await result!={}){
        current_user_updater(result)
        res.sendFile(__dirname+'./account',{result})
    }
    else {
        res.sendFile(__dirname+'/views/login.html',{msg:"Invalid Credentials"})
    }
});

app.post('/logout',function(req, res){
    var path = __dirname+'/controller/currentUser.json'
    fs.unlink(path,function(err){
        if(err) console.log(err)
        else{
            res.sendFile(__dirname+'/views/index.html',{name:"Login"})
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Site hosted on port ${PORT}.`)
})