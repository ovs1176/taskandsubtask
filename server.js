const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); 

const app = express();
const PORT = 3000;

const authMiddleware = require('./middleware/auth');

// Importing models
const SubTask = require("./models/subTask");
const User = require("./models/user");
const Task = require("./models/task");

app.use(bodyParser.json());

app.use('/tasks', authMiddleware);

global.db = mongoose
  .connect("mongodb://127.0.0.1:27017/taskManager")
  .then(() => {
    console.log("Connected to MongoDB");

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Something went wrong!");
    });
  })
  .catch((error) => {
    console.error("Error connecting to MOongoDB", error);
  });

// Import tasks router
const tasksRoutes = require('./routes/tasks');
app.use('/tasks', tasksRoutes);

// Import users route
const usersRoutes = require('./routes/users');
app.use("/users", usersRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
