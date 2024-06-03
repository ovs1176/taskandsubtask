const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Task = require("../models/task");
const SubTask = require("../models/subTask");
const ObjectId = require('mongodb').ObjectId;

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
          $match: {
            user_id: new ObjectId(
              user.userId
            ),
            is_deleted: false
          }
        },
        {
          $lookup: {
            from: 'subtasks',
            localField: '_id',
            foreignField: 'task_id',
            as: 'subtasks',
            pipeline: [
              { $match: { is_deleted: false } }
            ]
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

    let taskExist = await Task.find({_id : req.params.taskId, is_deleted: true});
    if(taskExist.length ) return res.send({error : "Either task not found or already deleted. "}); 

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
    const {taskId} = req.params; 
    const {subject, deadline, status } = req.body;

    let taskExist = await Task.find({_id : taskId, user_id : req.user.userId, is_deleted : false });
    if(!taskExist.length ) return res.send({status:false, message : "No any task found with given taskId"}); 


    const newSubTask = new SubTask({
      task_id : new ObjectId(taskId),
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
    res.status(500).json({ error: "Internal server error" , message : error.message});
  }
});

// Get all user subtasks
router.get("/:taskId/subtasks", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { taskId } = req.params;

    let taskExist = await Task.find({_id : taskId, user_id : user.userId, is_deleted : false });

    if(!taskExist.length ) return res.send({status:false, message : "No any task found with given taskId"}); 

    let subtasksQuery = { task_id : taskId, is_deleted : false };

    const subtasks = await SubTask.find(subtasksQuery);

    return res.status(200).json({ message : "Subtask fetched successfully", subtasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Intenal server error" });
  }
});

//Update subtask
router.put("/:subtaskId/subtasks", authMiddleware, async (req, res) => {
  try {
    console.log("#update subtask working .... ", "req.params.subtaskId", req.params.subtaskId)
    const {subject, status ,deadline} = req.body;

    const updatedSubTask = await SubTask.findByIdAndUpdate(
      req.params.subtaskId,
      {
        status,
        subject,
        deadline
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
    let subtaskExist = await SubTask.find({_id : req.params.subtaskId, is_deleted: true});
    if(subtaskExist.length ) return res.send({error : "Either sub-task not found or already deleted. "}); 

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
