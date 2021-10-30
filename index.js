const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId
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


    // get API
    app.get('/services', async(req, res)=>{
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray()
        res.send(services)
    })

    // get single service 
    app.get('/services/:id', async(req, res)=>{
        const id = req.params.id
        const query = {_id:ObjectId(id)}
        const service = await servicesCollection.findOne(query)
    })
    // post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);
      res.send("post hitted");
        const result = await servicesCollection.insertOne(service);
        res.json(result);
    });
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
