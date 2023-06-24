const taskRoutes = require("express").Router();
const DB = require("../tasks.json");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const statusValues = ["pending", "in-progress", "completed"];
const writePath = path.join(__dirname, "..", "tasks.json");

taskRoutes.use(bodyParser.urlencoded({ extended: true }));
taskRoutes.use(bodyParser.json());

// get all tasks
taskRoutes.get("/", (req, res) => {
  res.status(200).send(DB.tasks);
});

// get task by id
taskRoutes.get("/:id", (req, res) => {
  let id = req.params.id;
  let tasks = DB.tasks;
  let requestedTasks = tasks.filter((v) => v.id == id);
  if (requestedTasks.length) {
    res.status(200).send(requestedTasks);
  } else {
    res.status(422).send({ message: `task with id = ${id} not found` });
  }
});

// create a task - input takes only title, description and status
taskRoutes.post("/", (req, res) => {
  const { title, description, status } = req.body;
  const message = [];
  if (!title || !title.length) {
    message.push({ Title: "Title can't be empty string" });
  }

  if (!description || !description.length) {
    message.push({ Description: "Description of task can't be empty" });
  }

  if (!statusValues.includes(status)) {
    message.push({ TaskStatus: `status should be one of [${statusValues}]` });
  }

  if (message.length) {
    res.status(422).send(message);
    return;
  }

  let tasks = DB.tasks;
  let id;
  // res.send(tasks);
  if (tasks.length) {
    let [{ id: lastId }] = tasks.slice(-1);
    id = ++lastId;
  } else id = 1;

  const newTask = {
    id: id,
    title: title,
    description: description,
    status: status,
    created_at: Date.now(),
  };

  let modifiedDb = DB;
  modifiedDb.tasks.push(newTask);
  fs.writeFile(writePath, JSON.stringify(modifiedDb), (e) => {
    if (e) {
      res.status(500).send({ message: "Internal Server Error" });
    } else {
      res
        .status(200)
        .send({ message: "Task created successfully", task: newTask });
    }
  });
});

// update a task by id
taskRoutes.put("/:id", (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const message = [];

  const taskIndex = DB.tasks.findIndex((v) => v.id == id);
  let task = DB.tasks[taskIndex];

  if (task) {
    if (updates.hasOwnProperty("title")) {
      if (!updates.title.length) {
        message.push({ Title: "Title can't be empty string" });
      }
      task.title = updates.title;
    }
    if (updates.hasOwnProperty("description")) {
      if (!updates.description.length) {
        message.push({ Description: "Description of task can't be empty" });
      }
      task.description = updates.description;
    }
    if (updates.hasOwnProperty("status")) {
      if (statusValues.includes(updates.status)) {
        task.status = updates.status;
      } else {
        message.push({
          TaskStatus: `status should be one of [${statusValues}]`,
        });
      }
    }

    if (message.length) {
      res.status(422).send(message);
      return;
    }

    let modifiedDb = DB;
    modifiedDb.tasks[taskIndex] = task;
    fs.writeFile(writePath, JSON.stringify(modifiedDb), (e) => {
      if (e) {
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.status(200).send({ message: "Task updated successfully", task });
      }
    });
  } else res.status(422).send(`task with id = ${id} not found`);
});

//delete a task by id
taskRoutes.delete("/:id", (req, res) => {
  const id = req.params.id;

  let task = DB.tasks.filter((v) => v.id == id),
    modifiedDb = DB;

  if (task.length) {
    modifiedDb.tasks = DB.tasks.filter((v) => v.id != id);
    fs.writeFile(writePath, JSON.stringify(modifiedDb), (e) => {
      if (e) {
        res.status(500).send({ message: "Internal Server Error" });
      } else {
        res.status(200).send({ message: "task deleted successfully" });
      }
    });
  } else
    res.status(422).send({ message: `task with id = ${id} doesn't exist` });
});

module.exports = taskRoutes;
