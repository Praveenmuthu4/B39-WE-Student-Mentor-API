import { client } from "./index.js";

export async function updateMentor(MentorName, findMentor) {
  return await client
    .db("StudentMentorAPI")
    .collection("mentor")
    .updateOne({ MentorName: MentorName }, { $set: findMentor });
}

export async function updateStudent(Student, mentorName) {
  await client
    .db("StudentMentorAPI")
    .collection("student")
    .updateOne({ StudentName: Student }, { $set: mentorName });
}

export async function getMentor(Mentor) {
  return await client
    .db("StudentMentorAPI")
    .collection("mentor")
    .findOne({ MentorName: Mentor });
}

export async function getMentors() {
  return await client
    .db("StudentMentorAPI")
    .collection("mentor")
    .find({})
    .toArray();
}

export async function getStudents() {
  return await client
    .db("StudentMentorAPI")
    .collection("student")
    .find({})
    .toArray();
}

export async function getStudent(StudentName) {
  return await client
    .db("StudentMentorAPI")
    .collection("student")
    .findOne({ Students: StudentName });
}

export async function getStudentsbyMentorName(id) {
    return await client
      .db("StudentMentorAPIb39we")
      .collection("student")
      .find({ MentorName: id })
      .toArray();
  }