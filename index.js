const express = require("express");
const app = express();
const cors = require('cors');
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require('dotenv').config()
const URL = process.env.DB;
app.use(express.json());
app.use(cors({
    orgin: "*"
}));
 
//.......................Default Page...........................//
app.get("/", (req, res) =>
  res.send(`Server Running successfully.....!`)
);
//.......................1.Mentor Creation...........................//
app.post("/mentor", async function (request, response) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assignmentor");
      await db.collection("mentors").insertOne(request.body);
      await connection.close();
      response.status(200).json({message: "Mentor added Successfully"});
    } catch (error) {
      console.log(error);
    }
  });


//.......................2.Student Creation...........................//
app.post("/student", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    await db.collection("students").insertOne(request.body);
    await connection.close();
    response.status(200).json({message: "student added Successfully"});
  } catch (error) {
    console.log(error);
  }
});

//.......................get students...........................//

app.get("/students", async function (request, response) {
    try {
      const connection = await mongoClient.connect(URL);
      const db = connection.db("assignmentor");
      const result = await db.collection("students").find().toArray();
      await connection.close();
      response.status(200).json(result);
    } catch (error) {
      console.log(error);
    }
  });

//.......................Get Mentors...........................//

app.get("/mentors", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    const result = await db.collection("mentors").find().toArray();
    await connection.close();
    response.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});


//.......................3(i).Select one mentor and Add multiple Student...........................//

app.put("/mentor/:id", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    await db.collection("mentors").updateOne({ _id: mongodb.ObjectId(request.params.id) },{ $push: { students: mongodb.ObjectId(request.body) } });
    response.status(200).json({message: "Students Added Successfully"});
  } catch (error) {
    console.log(error);
  }
});


//.......................3(ii).A student who has a mentor should not be shown in List...........................//

app.get("/no-mentors", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    const result = await db.collection("students").find({ mentor: undefined }).toArray();
    await connection.close();
    response.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});

//.......................4.Select One Student and Assign one Mentor...........................//


app.put("/student/:id", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    await db.collection("students").updateOne({ _id: mongodb.ObjectId(request.params.id) },{ $set: { mentor: request.body } });
    response.status(200).json({message: "Mentor Assigned Successfully",});
  } catch (error) {
    console.log(error);
  }
});

//.......................5.API to show all students for a particular mentor...........................//

app.get("/mentor/:id/mentor-student", async function (request, response) {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db("assignmentor");
    const result = await db.collection("mentors").find({ _id: mongodb.ObjectId(request.params.id) },{ name: 1, students: 1, _id: 0 }).toArray();
    await connection.close();
    response.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
});



app.listen(process.env.PORT || 5000);