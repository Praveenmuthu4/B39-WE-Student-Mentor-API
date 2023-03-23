import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import {
  getMentor,
  getStudent,
  getStudents,
  getStudentsbyMentorName,
  updateMentor,
  updateStudent,
} from "./helper.js";

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
  console.log(studentData);
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
  console.log(mentorData);
  const result = await client
    .db("StudentMentorAPI")
    .collection("mentor")
    .insertMany(mentorData);
  mentorData
    ? res.send(result)
    : res.send({ message: "Mentor data was not added" });
});

app.put("/assignMentor", async function (req, res) {
  const mentor = req.body;
  const mentorName = { MentorName: mentor.MentorName };

  const findStudent = await client
    .db("StudentMentorAPI")
    .collection("student")
    .findOne({ MentorName: "" });
  if (!findStudent) {
    res.send({ message: "All students are assigned to concern mentor" });
    return;
  }
  const student = findStudent.StudentName;

  const findMentor = await getMentor(mentor.MentorName);
  findMentor.Students.push(student);
  const updatedMentor = await updateMentor(mentor.MentorName, findMentor);
  const updatedStudent = await updateStudent(student, mentorName);

  res.send(findMentor);
});

app.get("/StudentsOfMentor/:mentorName", async function (request, response) {
  const { mentorName } = request.params;
  const result = await getStudentsbyMentorName(mentorName);
  response.send(result);
});

app.put("/updateMentor/:StudentName", async function (request, response) {
  const Mentor = request.body;
  const { StudentName } = request.params;
  const findStudent = await getStudent(StudentName);

  const Student = findStudent.StudentName;
  const PreviousMentor = findStudent.MentorName;

  const findpreviousMentor = await getMentor(PreviousMentor);
  findpreviousMentor.Students.pop(Student);
  const updatePreviousMentor = await updateMentor(
    PreviousMentor,
    findpreviousMentor
  );

  const findMentor = await getMentor(Mentor.MentorName);
  findMentor.Students.push(Student);
  const updatedMentor = await updateMentor(Mentor.MentorName, findMentor);

  const newMentorName = {
    PreviousMentor: PreviousMentor,
    MentorName: Mentor.MentorName,
  };
  const updatedStudent = await updateStudent(Student, newMentorName);
  response.send(findMentor);
});

app.get("/PreviousMentor/:StudentName", async function (request, response) {
  const { StudentName } = request.params;
  const result = await getStudent(StudentName);
  result
    ? response.send({
        StudentName: StudentName,
        PreviousMentor: result.PreviousMentor,
      })
    : response.send({ message: "No Student available with that name" });
});

app.listen(PORT, () => console.log(`The server started in: ${PORT}`));
