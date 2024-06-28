const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.static('frontend'))

// cors - allow connection from different domains and ports
app.use(cors());

// convert json string to json object (from request)
app.use(express.json());

// mongo
const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;

// connect mongodb
mongoose.connect(mongoDB);
const db = mongoose.connection;

// check connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected");
});

// schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

// model
const Todo = mongoose.model("Todo", todoSchema, "todos");

// get all todos
app.get("/todos", async (request, response) => {
  const todos = await Todo.find({});
  response.json(todos);
});

// get todo by id
app.get("/todos/:id", async (request, response) => {
  const todo = await Todo.findById(request.params.id);
  if (todo) response.json(todo);
  else response.status(404).end();
});

// create todo
app.post("/todos", async (request, response) => {
  const { text } = request.body;
  const todo = new Todo({
    text: text,
  });
  const savedTodo = await todo.save();
  response.json(savedTodo);
});

// delete todo
app.delete("/todos/:id", async (request, response) => {
  const doc = await Todo.findById(request.params.id);
  if (doc) {
    await doc.deleteOne();
    response.json(doc);
  } else response.status(204).end();
});

// app.delete('/todos/:id', async (request, response) => {
//   const deletedTodo = await Todo.findByIdAndDelete(request.params.id)
//   if (deletedTodo) response.json(deletedTodo)
//   else response.status(204).end()
// })

// update todo
app.put("/todos/:id", async (request, response) => {
  const { text } = request.body;
  const todo = {
    text: text,
  };
  const updatedTodo = await Todo.findByIdAndUpdate(request.params.id, todo, {
    new: true,
  });
  response.json(updatedTodo);
});

module.exports = app;
