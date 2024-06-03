const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Task = require("../models/task");
const SubTask = require("../models/subTask");

const authMiddleware = require("../middleware/auth");

// Create Task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { subject, status, deadline } = req.body;
    const user = req.user; // from decoded JWT token

    if (!user || !user.userId) {
      console.error("Invalid user data in JWT:", user);
      return res.status(401).json({ error: "Invalid user data in JWT" });
    }

    const newTask = new Task({
      subject,
      status,
      deadline,
      user_id: user.userId,
    });

    await newTask.validate();

    await newTask.save();

    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user tasks with filters and pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const tasks = await Task.aggregate(
      [
        {
          $lookup: {
            from: 'subtasks',
            localField: '_id',
            foreignField: 'task_id',
            as: 'subtasks'
          }
        }
      ],
      { maxTimeMS: 60000, allowDiskUse: true }
    ); 


    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update task
router.put("/:taskId", authMiddleware, async (req, res) => {
  try {
    const { subject, status, deadline } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        subject, 
        status, 
        deadline
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).send({ error: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete task
router.delete("/:taskId", authMiddleware, async (req, res) => {
  try {
    let taskExist = await Task.find({_id : req.params.taskId, is_deleted: true});
    console.log(taskExist); 
    if(taskExist.length ) return res.send({error : "Either task not found or already deleted. "}); 

    const deletedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        is_deleted: true,
      },
      { new: true }
    );

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal error server" });
  }
});

// Create subtask
router.post("/:taskId/subtasks", authMiddleware, async (req, res) => {
  try {
    const task_id = req.params; 
    const {subject, deadline, status } = req.body;

    const newSubTask = new SubTask({
      task_id,
      subject,
      deadline,
      status
    });

    await newSubTask.save();

    return res
      .status(201)
      .json({ message: "Subtask created successfully", subTask: newSubTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all user subtasks
router.get("/:taskId/subtasks", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { taskId } = req.params;

    let subtasksQuery = { user_id: user.id };

    if (taskId) {
      subtasksQuery.task_id = taskId;
    }

    const subtasks = await SubTask.find(subtasksQuery);

    return res.status(200).json({ subtasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Intenal server error" });
  }
});

//Update subtask
router.put("/:subtaskId/subtasks", authMiddleware, async (req, res) => {
  try {
    const {subject, status ,deadline} = req.body;

    const updatedSubTask = await SubTask.findByIdAndUpdate(
      req.params.subtaskId,
      {
        status,
        subject,
        deadline,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedSubTask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    return res.json({
      message: "Subtask updated successfully",
      subTask: updatedSubTask,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete subtask
router.delete("/:subtaskId/subtasks", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const deletedSubTask = await SubTask.findByIdAndUpdate(
      req.params.subtaskId,
      {
        is_deleted: true,
      },
      { new: true }
    );

    if (!deletedSubTask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    return res.status(200).json({
      message: "Subtask deleted successfully",
      subTask: deletedSubTask,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
