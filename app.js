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

app.use('/images',express.static(path.resolve(__dirname,"/assets/images")))
app.use('/js',express.static(path.resolve(__dirname,"/assets/js")))
app.use(express.static("assets"));
app.use(express.static(__dirname + '/assets/css'));

var user=require(__dirname+"/server/model/user")
var questions=require(__dirname+"/server/model/questions")
var history=require(__dirname+"/server/model/history")
var matched=require(__dirname+"/server/model/matched")

app.get('/', (req,res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.get('/index.html', (req,res)=>{
    res.sendFile(__dirname+'/views/index.html')
})

app.get('/login.html', (req,res)=>{
    res.sendFile(__dirname+'/views/login.html')
})

app.get('/profile.html', (req,res)=>{
    res.sendFile(__dirname+'/views/profile.html')
})

app.get('/register.html', (req,res)=>{
    res.sendFile(__dirname+'/views/register.html')
})

app.get('/faq.html', (req,res)=>{
    res.sendFile(__dirname+'/views/faq.html')
})

app.get('/history.html', (req,res)=>{
    res.sendFile(__dirname+'/views/history.html')
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

const user_ques_values=async(username)=>{
    try{
        const data=await questions.find({username: username})
        return data
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
        res.sendFile(__dirname+'/views/login.html')
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

const match=async(username)=>{
    var max_count=0, count=0, max_match_data, index, hflag=0, mflag=0, total_count=0, total_data={}, data={}
    try{
        data=await questions.find({username: username})
    }catch(error){
        console.log(error.message)
    }
    try{
        total_count=await questions.find({username: username}).countDocuments()
        total_data=await questions.find({username: username})
    }catch(error){
        console.log(error.message)
    }
    for(let i=0;i<total_count;i++){
        count=0
        try{
            hflag=await history.find({$or: [{$and: [{username1: username}, {username2: total_data[i].username}]}, {$and: [{username2: username}, {username1: total_data[i].username}]}]}).countDocuments()
        }catch(error){
            console.log(error.message)
        }
        try{
            mflag=await matched.find({$or: [{$and: [{username1: username}, {username2: total_data[i].username}]}, {$and: [{username2: username}, {username1: total_data[i].username}]}]}).countDocuments()
        }catch(error){
            console.log(error.message)
        }
        if(total_data[i].username!=username){
            if(total_data[i].whom!=data.whom && hflag!=0 && mflag!=0 ){
                if(total_data[i].location==data.location){
                    count++;
                }
                if(total_data[i].emoji==data.emoji){
                    count++;
                }
                if(total_data[i].reply==data.reply){
                    count++;
                }
                if(total_data[i].work_live==data.work_live){
                    count++;
                }
                if(total_data[i].friend==data.friend){
                    count++;
                }
                if(total_data[i].insta_net==data.insta_net){
                    count++;
                }
                if(total_data[i].bird_owl==data.bird_owl){
                    count++;
                }
                if(total_data[i].pet==data.pet){
                    count++;
                }
                if(total_data[i].travel==data.travel){
                    count++;
                }
                if(total_data[i].relationship==data.relationship){
                    count++;
                }
                if(total_data[i].sunday==data.sunday){
                    count++;
                }
                if(total_data[i].movie_serial_tv==data.movie_serial_tv){
                    count++;
                }
                if(total_data[i].party==data.party){
                    count++;
                }
                if(total_data[i].tattoo==data.tattoo){
                    count++;
                }
                if(total_data[i].music==data.music){
                    count++;
                }
                if(total_data[i].employment==data.employment){
                    count++;
                }
                if(count>max_count){
                    max_count=count
                    index=i
                    max_match_data=total_data[i]
                }
            }
        }
    }
    let percent=(max_count/16)*100
    if(percent>50){
        try{
            const ques=new questions({
                    username1:username,
                    username2:match_data.username
                })
                ques.save()
                return true
                // res.sendFile(__dirname+'/views/account.html')
            }catch(error){
                console.log(error)
                res.send("Some error occured")
            }
        return {match_data:match_data,percent,show: 1} 
    }
    else{
        return {match_data:match_data,percent,show: 0} 
    }
}

app.post('/login',async (req, res)=>{
    const result=await user_finder(req.body.username, req.body.password)
    if(await result!={}){
        current_user_updater(result)
        const value=await user_ques(req.body.username)
        if(value==0){
            res.sendFile(__dirname+'/views/choices.html',{username: req.body.username})
            // res.send(req.body.username)
        }
        else{
            const data=await match(req.body.username)
            if(data.show==0){
                res.sendFile(__dirname+'/views/no_match.html', {match_data: data.match_data, percent: data.percent})
            }
            else{
                res.sendFile(__dirname+'/views/match.html',{match_data: data.match_data, percent: data.percent})
            }
        }
    }
    else{
        res.sendFile(__dirname+'/views/login.html',{msg:"Invalid Credentials"})
    }
});

const updater=async(value1, req)=>{
    try{
        const ques=new questions({
                username:value1,
                location:req.body.location,
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
    var data
    fs.readFile('./server/controller/currentUser.json','utf-8',(err,currentUserData)=>{
        if(err) console.log(err)
        else{
            try {
                data=JSON.parse(currentUserData)
                if(updater(data.username, req)){
                    const data= match(data.username)
                    res.sendFile(__dirname+'/views/match',{data})
                }
            } catch (error) {
                res.sendFile(__dirname+'/views/match.html',{data})
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
        location:req.body.location,
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

app.get('/edit_profile', async (req, res)=>{
    const data1=current_user()
    const data2=user_ques_values(data1.username)
    res.sendFile(__dirname+'/views/profile.html', {data1, data2})
})

app.post('/logout',function(req, res){
    var path = __dirname+'/controller/currentUser.json'
    fs.unlink(path,function(err){
        if(err) console.log(err)
        else{
            res.sendFile(__dirname+'/views/index.html')
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Site hosted on port ${PORT}.`)
})