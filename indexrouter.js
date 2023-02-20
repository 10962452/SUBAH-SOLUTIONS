const express = require("express");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB database");
  } catch (err) {
    console.log(err.stack);
  }
}

connectToDatabase();

const router = express.Router();

router.get("/", (req, res) => {
  const student = req.query.student;
  console.log(student);
  res.send(student + "!");
});

router.post("/create_account", async (req, res) => {
  const { student } = req.body;

  try {
    const db = client.db("students");
    const collection = db.collection("registration");
    const result = await collection.insertOne(student);
    console.log("New registration created:", result.ops[0]);

    res.json({
      registration: "Signed up",
      status: "You have been successfully registered!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create new registration" });
  }
});

router.get("/StudentregDetails", async (req, res) => {
  const { StudentID, Pin } = req.query;

  try {
    const db = client.db("students");
    const collection = db.collection("registration");
    const student = await collection.findOne({ StudentID, Pin });

    if (!student) {
      return res.status(404).json({ error: "This account does not exist" });
    }

    const studentDetails = {
      Studentname: student.Studentname,
      StudentID: student.StudentID,
      Course: student.Course,
      Residence: student.Residence,
      Level: student.Level,
    };

    return res.json(studentDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve student details" });
  }
});

router.delete("/delete", async (req, res) => {
  const { StudentID, Pin } = req.body;

  try {
    const db = client.db("students");
    const collection = db.collection("registration");
    const result = await collection.deleteOne({ StudentID, Pin });

    if (result.deletedCount === 0) {
      return res.json({
        errorStatus: "Credentials did not match any registered accounts",
      });
    }

    const StudentregDetails = await collection.find().toArray();
    res.json(StudentregDetails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete registration" });
  }
});

module.exports = router;
