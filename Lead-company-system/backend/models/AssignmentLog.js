const mongoose = require("mongoose")

const leadAssignmentLogSchema = new mongoose.Schema({
  lead: { type: ObjectId, ref: "Lead" },
  assignedTo: { type: ObjectId, ref: "User" },
  team: { type: ObjectId, ref: "Team" },
  assignedAt: Date,
  assignedBy: { type: ObjectId, ref: "User" }
});

const LeadAssignmentLog = mongoose.model("LeadAssignmentLog", leadAssignmentLogSchema);

module.exports = {
LeadAssignmentLog
}