const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    required: true,
    default: "TODO",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  }
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
