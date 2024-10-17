const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  deadline: {
    type: Date,
    required: function () {
      return this.isNew;
    },
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
