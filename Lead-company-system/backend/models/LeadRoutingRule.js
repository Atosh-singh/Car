// models/LeadRoutingRule.js

const mongoose = require("mongoose");

const leadRoutingRuleSchema = new mongoose.Schema({
  name: String,

  conditions: {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    carType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CarType"
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car"
    }
  },

  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    }
  ],

  priority: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const LeadRoutingRule = mongoose.model("LeadRoutingRule", leadRoutingRuleSchema);

module.exports = { LeadRoutingRule };