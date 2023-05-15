const express = require('express')
const {ObjectId} = require('mongodb')
const { connectToDb , getDb} = require('./dbconnection')
const app = express()

app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

let db
connectToDb((err)=>{
    if(!err){
        app.listen(5000 ,()=> {
            console.log("app listening at http://localhost:5000")
        })
        db = getDb()
    }
})

app.get('/' , (req , res)=>{
    res.json({"data":"this is data"})
})

app.get('/tasks' , (req , res)=>{
    var tasks = []
    db.collection('tasks').find().sort({date:1}).forEach(element =>
        tasks.push(element))
    .then(()=>{
        res.status(200).json({tasks})
    })
    .catch((err)=>{
        res.status(500).json({"err found" : err})
    })
})

app.post('/newtask' , (req ,res)=>{
    const task = req.body
    db.collection('tasks').insertOne(task)
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
    res.status(500).json({err : "Could not create"})
    })
})

app.delete('/deletetask/:id' , (req , res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('tasks')
        .deleteOne({_id:new ObjectId(req.params.id)})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not Delete '})
        })
    }
    else{
        res.status.json({error : 'Not a valid doc id'})
    }
})

app.patch('/edittask/:id' , (req,res) => {
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('tasks')
        .updateOne({_id:new ObjectId(req.params.id)} , {$set: updates})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error: 'Could not Upadate '})
        })
    }
    else{
        res.status.json({error : 'Not a valid doc id'})
    }
})