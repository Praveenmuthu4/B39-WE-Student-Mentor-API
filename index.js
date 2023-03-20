import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Mongo is connected ");

app.use(express.json());

app.get("/", function (req, res) {
  res.send("Welcome to Student Mentor API");
});

app.get("/student", async function (req, res) {
  const result = await client
    .db("StudentMentorAPI")
    .collection("student")
    .find({})
    .toArray();

  result ? res.send(result) : res.status(404).send("Student Data not Found");
});

app.get("/mentor", async function (req, res) {
    const result = await client
      .db("StudentMentorAPI")
      .collection("mentor")
      .find({})
      .toArray();
  
    result ? res.send(result) : res.status(404).send("Mentor Data not Found");
  });

app.post("/createStudent", async function (req, res) {
  const studentData = req.body;
  console.log(data);
  const result = await client
    .db("StudentMentorAPI")
    .collection("student")
    .insertMany(studentData);
    studentData
    ? res.send(result)
    : res.send({ message: "Student data was not added" });
});

app.post("/createMentor", async function (req, res) {
    const mentorData = req.body;
    console.log(data);
    const result = await client
      .db("StudentMentorAPI")
      .collection("mentor")
      .insertMany(mentorData);
      mentorData
      ? res.send(result)
      : res.send({ message: "Mentor data was not added" });
  });


  app.put("/assignMentor", async function (request, response) {
    const Mentor = request.body;
  
    const findStudent = await client
      .db("StudentMentorAPI")
      .collection("student")
      .findOne({ MentorName: "" });
  
    const Student = findStudent.StudentName;
    const findMentor = await client
      .db("StudentMentorAPIb39we")
      .collection("mentor")
      .findOne({ MentorName: Mentor.MentorName });
  
    const mentorName = { MentorName: Mentor.MentorName };
    console.log(findMentor);
    findMentor.Students =
      typeof findMentor.Students === typeof []
        ? [Student]
        : findMentor.Students.push(Student);
    console.log(Student);
    const updateMentor = await client
      .db("StudentMentorAPI")
      .collection("mentor")
      .updateOne({ MentorName: Mentor.MentorName }, { $set: findMentor });
  
    const updateStudent = await client
      .db("StudentMentorAPI")
      .collection("student")
      .updateOne({ StudentName: Student }, { $set: mentorName });
    response.send(updateMentor);
  });


app.listen(PORT, () => console.log(`The server started in: ${PORT}`));
