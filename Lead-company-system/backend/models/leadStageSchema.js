const mongoose = require("mongoose");


const leadStageSchema = new mongoose.Schema({
  name: String,
  order: Number
});

const LeadStageSchema = mongoose.model("LeadStageSchema", leadStageSchema);

module.exports = {
    LeadStageSchema
}