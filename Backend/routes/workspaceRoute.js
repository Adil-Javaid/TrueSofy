const express = require("express");
const router = express.Router();
const Workspace = require("../Schema/Workspace");
const User = require("../Schema/User");
const { authentication, authorized } = require("../middleware/auth");

router.get("/", authentication, async (req, res) => {
  try {
    const workspaces = await Workspace.find({}).populate(
      "teamLead",
      "username"
    );
    res.json(workspaces);
  } catch (err) {
    console.error("Error fetching workspaces:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post(
  "/create",
  authentication,
  authorized("admin"),
  async (req, res) => {
    const { name, teamLeadId } = req.body;
    try {
      const existingWorkspace = await Workspace.findOne({ name });
      if (existingWorkspace) {
        return res
          .status(400)
          .json({ message: "Workspace name already exists" });
      }

      const teamLead = await User.findById(teamLeadId);
      if (!teamLead || teamLead.role !== "team_lead") {
        return res.status(400).json({ message: "Invalid team lead" });
      }

      const workspace = new Workspace({
        name,
        teamLead: teamLeadId,
      });

      await workspace.save();
      teamLead.workspaces.push(workspace._id);
      await teamLead.save();

      res.status(201).json({ message: "Workspace created", workspace });
    } catch (err) {
      
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

router.get("/my-workspaces", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("workspaces");
    res.json(user.workspaces);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
