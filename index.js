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


app.listen(PORT, () => console.log(`The server started in: ${PORT}`));
