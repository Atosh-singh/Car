const {Lead} = require("../../models/Lead")

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found"
      });
    }

    const previousStatus = lead.status;

    lead.status = status;

    lead.statusHistory.push({
      from: previousStatus,
      to: status,
      changedBy: req.user._id
    });

    await lead.save();

    res.json({
      message: "Status updated",
      lead
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateLeadStatus };