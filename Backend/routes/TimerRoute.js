const express = require("express");
const router = express.Router();
const User = require("../Schema/User"); 
const Task = require("../Schema/TaskSchema");
const { authentication, authorized } = require("../middleware/auth");

const Timer = require("../Schema/Timer");

router.post("/:taskId/start-timer", authentication, async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task || task.assignedTo.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    const existingTimer = await Timer.findOne({
      task: taskId,
      user: req.user._id,
      endTime: null,
    });
    if (existingTimer) {
      return res.status(400).json({ message: "Timer already running" });
    }

    const timer = new Timer({
      user: req.user._id,
      task: taskId,
      startTime: Date.now(),
    });

    await timer.save();
    res.status(201).json({ message: "Timer started", timer });
  } catch (err) {
    console.error("Error starting timer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/:taskId/stop-timer", authentication, async (req, res) => {
  const { taskId } = req.params;

  try {
    const timer = await Timer.findOne({
      task: taskId,
      user: req.user._id,
      endTime: null,
    });
    if (!timer) {
      return res.status(404).json({ message: "No active timer found" });
    }

    timer.endTime = Date.now();
    timer.duration = Math.floor((timer.endTime - timer.startTime) / 1000);
    await timer.save();

    res.status(200).json({ message: "Timer stopped", timer });
  } catch (err) {
    console.error("Error stopping timer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get('/my-daily-work-hours', authentication, async (req, res) => {
  const { date } = req.query;
  const selectedDate = new Date(date).setHours(0, 0, 0, 0);

  try {
    const timers = await Timer.find({
      user: req.user._id,
      startTime: { $gte: new Date(selectedDate), $lt: new Date(selectedDate + 24 * 60 * 60 * 1000) }
    });

    const totalSeconds = timers.reduce((sum, timer) => sum + timer.duration, 0);
    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

    res.json({ totalHours, totalMinutes, timers });
  } catch (err) {
    console.error('Error fetching work hours:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get(
  "/member/:userId/daily-work-hours",
  authentication,
  authorized("admin", "team_lead"),
  async (req, res) => {
    const { userId } = req.params;
    const { date } = req.query;
    const selectedDate = new Date(date).setHours(0, 0, 0, 0);

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      
      const timers = await Timer.find({
        user: userId,
        startTime: {
          $gte: new Date(selectedDate),
          $lt: new Date(selectedDate + 24 * 60 * 60 * 1000),
        },
      })
        .populate({
          path: "task",
          select: "description", 
        })
        .populate({
          path: "workspace",
          select: "name", 
        });

      const totalSeconds = timers.reduce(
        (sum, timer) => sum + timer.duration,
        0
      );
      const totalHours = Math.floor(totalSeconds / 3600);
      const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

      res.json({ user: user.username, totalHours, totalMinutes, timers });
    } catch (err) {
      console.error("Error fetching member work hours:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router
