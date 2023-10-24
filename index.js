const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5001;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Running :<h2> Made by Mahbubul Alam</h2>");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xmhqmx1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const foodMenu = client.db("foodOrder").collection("foodMenu");

    const userCollection = client.db("foodOrder").collection("user");

    app.get("/menu", async (req, res) => {
      const cursor = foodMenu.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/menu/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodMenu.findOne(query);
      res.send(result);
    });

    app.post("/menuitem", async (req, res) => {
      const newMenuItem = req.body;
      console.log(newMenuItem);
      const result = await foodMenu.insertOne(newMenuItem);
      res.send(result);
    });

    app.put("/menuitem/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFood = req.body;
      const food = {
        $set: {
          name: updatedFood.name,
          price: updatedFood.price,
          category: updatedFood.category,
          rating: updatedFood.rating,
          photo: updatedFood.photo,
          description: updatedFood.description,
        },
      };
      const result = await foodMenu.updateOne(filter, food, options);
      res.send(result);
    });

    app.delete("/menuitem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodMenu.deleteOne(query);
      res.send(result);
    });

    // user related apis
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const users = await cursor.toArray();
      res.send(users);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.patch("/user", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updatedDoc = {
        $set: {
          lastSignInTime: user.lastSignInTime,
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);

      res.send(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is runing on http://localhost:${port}`);
});
