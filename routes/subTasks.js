const express = require("express");
const router = express.Router();
const SubTask = require("../models/subTask");
const authMiddleware = require("../middleware/auth");

// Create subtask
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const {task_id, subject, deadline, status } = req.body;

//     const newSubTask = new SubTask({
//       task_id,
//       subject,
//       deadline,
//       status
//     });

//     await newSubTask.save();

//     return res
//       .status(201)
//       .json({ message: "Subtask created successfully", subTask: newSubTask });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Get all user subtasks
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const user = req.user;
//     const { task_id } = req.query;

//     let subtasksQuery = { user_id: user.id };

//     if (task_id) {
//       subtasksQuery.task_id = task_id;
//     }

//     const subtasks = await SubTask.find(subtasksQuery);

//     return res.status(200).json({ subtasks });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Intenal server error" });
//   }
// });

// //Update subtask
// router.put("/:subtaskId", authMiddleware, async (req, res) => {
//   try {
//     const {subject, status ,deadline} = req.body;

//     const updatedSubTask = await SubTask.findByIdAndUpdate(
//       req.params.subtaskId,
//       {
//         status,
//         subject,
//         deadline,
//         updated_at: new Date()
//       },
//       { new: true }
//     );

//     if (!updatedSubTask) {
//       return res.status(404).json({ error: "Subtask not found" });
//     }

//     return res.json({
//       message: "Subtask updated successfully",
//       subTask: updatedSubTask,
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// //Delete subtask
// router.delete("/:subtaskId", authMiddleware, async (req, res) => {
//   try {
//     const user = req.user;

//     const deletedSubTask = await SubTask.findByIdAndUpdate(
//       req.params.subtaskId,
//       {
//         is_deleted: true,
//       },
//       { new: true }
//     );

//     if (!deletedSubTask) {
//       return res.status(404).json({ error: "Subtask not found" });
//     }

//     return res.status(200).json({
//       message: "Subtask deleted successfully",
//       subTask: deletedSubTask,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
