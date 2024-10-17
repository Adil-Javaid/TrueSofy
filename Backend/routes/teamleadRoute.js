const express = require("express");
const router = express.Router();
const Workspace = require("../Schema/Workspace");
const User = require("../Schema/User");
const { authentication, authorized } = require("../middleware/auth");

router.get(
  "/team-leads",
  authentication,
  authorized("admin", "team_lead"),
  async (req, res) => {
    try {
      const teamLeads = await User.find({ role: "team_lead" }).select(
        "username _id"
      );

      if (!teamLeads.length) {
        return res.status(404).json({ message: "No team leads found" });
      }

      res.json(teamLeads);
    } catch (err) {
      console.error("Error fetching team leads:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

router.post(
  "/:workspaceId/add-member",
  authentication,
  authorized("team_lead"),
  async (req, res) => {
    const { memberId } = req.body;
    const { workspaceId } = req.params;

    try {
      const workspace = await Workspace.findById(workspaceId);
      const member = await User.findById(memberId);

      if (!workspace || !member) {
        return res
          .status(404)
          .json({ message: "workspace or member not found" });
      }

      if (workspace.teamLead.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      workspace.members.push(memberId);
      member.workspaces.push(workspaceId);

      await workspace.save();
      await member.save();

      res.status(200).json({ message: "Member added" });
    } catch (err) {
      res.status(500).json({ message: "server error" });
    }
  }
);

router.get(
  "/all-members",
  authentication,
  authorized("team_lead"),
  async (req, res) => {
    try {
      const users = await User.find({ role: "team_member" }).select(
        "username _id"
      );
      res.json(users);
    } catch (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
