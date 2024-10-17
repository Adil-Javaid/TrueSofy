const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "team_lead", "team_member"],
    default: "team_member",
  },
  workspaces: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Workspace",
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
