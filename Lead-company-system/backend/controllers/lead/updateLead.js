const mongoose = require("mongoose");
const { Lead } = require("../../models/Lead");
const leadService = require("../../services/lead.service");

const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔐 Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Lead ID",
      });
    }

    // 🔍 Check if lead exists & not removed
    const existingLead = await Lead.findOne({
      _id: id,
      removed: false,
    });

    if (!existingLead) {
      return res.status(404).json({
        message: "Lead not found or already deleted",
      });
    }

    // 🚀 Update using service
    const updatedLead = await leadService.updateLead(id, req.body);

    res.status(200).json({
      message: "✅ Lead updated successfully",
      data: updatedLead,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { updateLead };
