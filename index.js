const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = "TodoList4000" 

const uri = "mongodb+srv://todoList:TodoList4000@cluster0.zxfa1.mongodb.net/todoListFriends?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
                                          
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  })


  client.connect(err => {
      const friendCollection = client.db("todoListFriends").collection("Friends");
      app.get('/friends', (req, res) => {
        friendCollection.find({})
        .toArray((err, documents) => {
          res.send(documents);
        })
      })
      
      app.get('/friend/:id', (req, res) => {
        friendCollection.find({ _id: ObjectId(req.params.id) })
        .toArray((err, documents) => {
          res.send(documents[0]);
        })
      })
      
      app.post("/addFriend", (req, res) => {
        const friend = req.body;
        friendCollection.insertOne(friend)
        .then(result => {         
            res.redirect('/')         
        })        
      })

      app.patch("/update/:id", (req, res) => {
        friendCollection.updateOne({ _id: ObjectId(req.params.id)},      
        {
          $set: {age: req.body.age, quantity: req.body.quantity}
        })
        .then(result => {
          res.send(result.modifiedCount > 0);
        })
      })

      app.delete("/delete/:id", (req, res) => {
        friendCollection.deleteOne({ _id: ObjectId(req.params.id)})
        .then(result => {
          res.send(result.deletedCount > 0);       
        })
      })
    
  });
  
  
  app.listen(8000)