const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 5000;

// set middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fch2j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    //   console.log("connected to database");
    const database = client.db("travelDB");
    const servicesCollection = database.collection("services");
    // users data
    const usersCollection = database.collection("users")

    // get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get users API
    app.get("/users", async(req, res)=>{
      const cursor = usersCollection.find({})
      const users = await cursor.toArray()
      res.send(users)
    })

    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting id", id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });
    // post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });


    // post API for users
    app.post('/users', async(req, res)=>{
      const newUser = req.body
      const result = await usersCollection.insertOne(newUser)
      console.log('hit the user console', req.body);
      console.log("added user", result);
        res.json(result)
    })



    // delete API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });


    // delete user API
    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.json(result)
    })
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running travel server");
});

app.listen(port, () => {
  console.log("running travel server on port", port);
});
