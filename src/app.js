const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("express").Router();
const taskRoutes = require("./routes/taskRoutes");

const app = express();
app.use(cors());
app.use(routes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;

routes.get("/", (req, res) => {
  res.status(200).send("Welcome to the Task Manager");
});

routes.use("/tasks", taskRoutes);

app.listen(PORT, (err) => {
  if (!err) {
    console.log("server started successfully");
  } else {
    console.log("some error occurred");
  }
});
