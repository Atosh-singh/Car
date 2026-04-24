const mongoose = require("mongoose");

const leadDistributionSchema = new mongoose.Schema({
  carType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarType",
    required: true
  },

  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],

  strategy: {
    type: String,
    enum: ["ROUND_ROBIN", "LOAD_BALANCE", "MANUAL"],
    default: "ROUND_ROBIN"
  },

  lastAssignedIndex: {
    type: Number,
    default: 0
  }
});

const LeadDistribution= mongoose.model("LeadDistribution", leadDistributionSchema)


module.exports = {
    LeadDistributionSchema
}