const mongoose = require("mongoose");

const subTaskSchema = mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
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
  is_deleted: {
    type: Boolean,
    default: false,
  }
});



const SubTask = mongoose.model("SubTask", subTaskSchema);
module.exports = SubTask;
