const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//* middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w3d5mtp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const mediaPostCollection = client
      .db("friendsvillage")
      .collection("mediapost");
    const profileCollection = client
      .db("friendsvillage")
      .collection("profile");

    const usersCollection = client.db("reselldotcom").collection("users");

    const sellerCollection = client.db("reselldotcom").collection("sellers");

    const bookingCollection = client
      .db("reselldotcom")
      .collection("booked_products");

    app.post("/addmediapost", async (req, res) => {
      const mediaPost = req.body;
      console.log(mediaPost);

      const result = await mediaPostCollection.insertOne(mediaPost);
      res.send(result);
    });

    //* read all mediapost data
    app.get("/media", async (req, res) => {
      const query = {};
      const cursor = mediaPostCollection.find(query);
      const media = await cursor.toArray();
      res.send(media);
    });

    //* read all profile data
    app.get("/profile", async (req, res) => {
      const query = {};
      const cursor = profileCollection.find(query);
      const profileResult = await cursor.toArray();
      res.send(profileResult);
    });
    //* update Profile all profile data
    app.get("/update/:id", async (req, res) => {
      const id = req.params.id
      const filter = {_id:ObjectId(id)}
      const data = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: data.name,
          email: data.email,
          university: data.university,
          address:data.address
        }
      }
      const result = profileCollection.updateOne(filter,updatedUser, option);
      const profileResult = await cursor.toArray();
      res.send(profileResult);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" Friend Village server Running");
});

app.listen(port, () => {
  console.log(`Friend Village   running on port ${port}`);
});
