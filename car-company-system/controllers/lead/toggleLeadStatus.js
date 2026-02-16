const mongoose = require("mongoose");
const leadService = require("../../services/lead.service");

const toggleLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Lead ID",
      });
    }

    const updatedLead = await leadService.toggleLeadStatus(id);

    if (!updatedLead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.status(200).json({
      message: "✅ Lead status toggled",
      data: updatedLead,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { toggleLeadStatus };
