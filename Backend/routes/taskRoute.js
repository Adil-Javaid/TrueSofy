const express = require("express");
const router = express.Router();
const Task = require("../Schema/TaskSchema");
const Workspace = require("../Schema/Workspace");
const User = require("../Schema/User");
const { authentication, authorized } = require("../middleware/auth");

router.post(
  "/:workspaceId/assign-task",
  authentication,
  authorized("team_lead"),
  async (req, res) => {
    const { description, assignedTo, deadline } = req.body;
    const { workspaceId } = req.params;

    try {
      const workspace = await Workspace.findById(workspaceId);
      const teamMember = await User.findById(assignedTo);

      if (!workspace || !teamMember) {
        return res
          .status(404)
          .json({ message: "Workspace or team member not found" });
      }

      if (workspace.teamLead.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const task = new Task({
        description,
        assignedTo: teamMember._id,
        workspace: workspace._id,
        status: "pending",
        deadline: deadline || new Date(),
      });

      workspace.tasks.push(task._id);
      await task.save();
      await workspace.save();

      res.status(201).json({ task });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

router.get("/team-member/tasks", authentication, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "workspace",
      "name"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put(
  "/tasks/:taskId/status",
  authentication,
  authorized("team_member"),
  async (req, res) => {
    const { status } = req.body;
    const { taskId } = req.params;

    try {
      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      task.status = status;
      await task.save();

      res.json({ task });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
