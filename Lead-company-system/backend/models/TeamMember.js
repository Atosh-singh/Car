const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({
  team: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Team" 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  roleInTeam: {
    type: String,
    enum: ["LEADER", "MEMBER"],
    default: "MEMBER"
  }
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);

module.exports = {
  TeamMember
};