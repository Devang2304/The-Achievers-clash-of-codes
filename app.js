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
var questions=require(__dirname+"/server/model/questions")

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.get('/login',async (req, res)=>{
    res.sendFile(__dirname+'/views/login.html')
});

app.get('/register',async (req, res)=>{
    res.sendFile(__dirname+'/views/register.html')
});

const user_ques=async(username)=>{
    try{
        const count=await questions.find({username: username}).countDocuments();
        return count
    }catch(error){
        console.log(error.message)
    }
}

app.post('/register',async (req,res)=>{
    try{
        const user_data=new user({
            name:req.body.name,
            username:req.body.username,
            age:req.body.age,
            gender:req.body.gender,
            location:req.body.location,
            contact:req.body.contact,
            email:req.body.email,
            password:req.body.password
        })
        user_data.save()
        current_user_updater(user_data)
        res.sendFile(__dirname+'/views/account.html')
    }catch(error){
        console.log(error)
        res.send("Some error occured")
    }
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
        const value=await user_ques(req.body.username)
        if(value>0){
            res.sendFile(__dirname+'/views/second_form')
        }
        else{
            res.sendFile(__dirname+'/views/account',{result})
        }
    }
    else {
        res.sendFile(__dirname+'/views/login.html',{msg:"Invalid Credentials"})
    }
});

const updater=async(value1, req)=>{
    try{
        const ques=new questions({
                username:value1,
                whom:req.body.whom
                // emojis:req.body.emojis,
                // reply:req.body.reply,
                // work_live:req.body.work_live,
                // friend:req.body.friend,
                // insta_net:req.body.insta_net,
                // bird_owl:req.body.bird_owl,
                // pet:req.body.pet,
                // travel:req.body.travel,
                // relationship:req.body.relationship,
                // sunday:req.body.sunday,
                // movie_serial_tv:req.body.movie_serial_tv,
                // party:req.body.party,
                // tattoo:req.body.tattoo,
                // music:req.body.music,
                // employment:req.body.employment
        })
        ques.save()
        return true
        // res.sendFile(__dirname+'/views/account.html')
    }catch(error){
        console.log(error)
        res.send("Some error occured")
    }
}

app.post('/questions',async (req,res)=>{
    fs.readFile('./server/controller/currentUser.json','utf-8',(err,currentUserData)=>{
        if(err) console.log(err)
        else{
            try {
                var data=JSON.parse(currentUserData)
                if(updater(data.username, req)){
                    res.send("details updated")
                }
            } catch (error) {
                console.log(error)
                res.send("Some error occured")
            }
        }   
    })
    
    // const new_details= await user.updateMany({username :data.username},[{"$set": {
    //             whom:req.body.whom,
    //             username: "rohit1"
    //             // emojis:req.body.emojis,
    //             // reply:req.body.reply,
    //             // work_live:req.body.work_live,
    //             // friend:req.body.friend,
    //             // insta_net:req.body.insta_net,
    //             // bird_owl:req.body.bird_owl,
    //             // pet:req.body.pet,
    //             // travel:req.body.travel,
    //             // relationship:req.body.relationship,
    //             // sunday:req.body.sunday,
    //             // movie_serial_tv:req.body.movie_serial_tv,
    //             // party:req.body.party,
    //             // tattoo:req.body.tattoo,
    //             // music:req.body.music,
    //             // employment:req.body.employment
    //         }}],{upsert:false, multi:true});

    // new_details.save()
    // res.sendFile(__dirname+'/views/user.html')        
})

app.post('/edit_profile',async (req,res)=>{
    const updated_details1= await user.updateOne({username :req.body.username},{$set: {
        name:req.body.name,
        age:req.body.age,
        gender:req.body.gender,
        location:req.body.location,
        contact:req.body.contact,
        email:req.body.email,
        password:req.body.password
    }});
    current_user_updater(updated_details1)
    const updated_details2= await questions.updateOne({username :req.body.username},{$set: {
        whom:req.body.whom,
        emojis:req.body.emojis,
        reply:req.body.reply,
        work_live:req.body.work_live,
        friend:req.body.friend,
        insta_net:req.body.insta_net,
        bird_owl:req.body.bird_owl,
        pet:req.body.pet,
        travel:req.body.travel,
        relationship:req.body.relationship,
        sunday:req.body.sunday,
        movie_serial_tv:req.body.movie_serial_tv,
        party:req.body.party,
        tattoo:req.body.tattoo,
        music:req.body.music,
        employment:req.body.employment
    }});
})

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