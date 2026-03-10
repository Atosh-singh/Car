const mongoose = require("mongoose");
const { Lead } = require("../../models/Lead");
const { User } = require("../../models/User");

const reassignLead = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid Lead ID or User ID"
      });
    }

    // 🔐 Role Check
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "MANAGER"];

    if (!allowedRoles.includes(req.user.role?.toUpperCase())) {
      return res.status(403).json({
        message: "Only manager or admin can reassign lead"
      });
    }

    session.startTransaction();

    const lead = await Lead.findOne(
      { _id: id, removed: false }
    ).session(session);

    if (!lead) {
      throw new Error("Lead not found");
    }

    const newUser = await User.findOne(
      { _id: userId, removed: false, enabled: true }
    ).session(session);

    if (!newUser) {
      throw new Error("New user not found or inactive");
    }

    const previousUserId = lead.assignedTo;

    // 🔽 Decrease previous user activeLeads
    if (previousUserId) {
      await User.updateOne(
        { _id: previousUserId },
        { $inc: { activeLeads: -1 } }
      ).session(session);
    }

    // 🔼 Increase new user activeLeads
    await User.updateOne(
      { _id: newUser._id },
      { $inc: { activeLeads: 1 } }
    ).session(session);

    // 🔄 Update Lead
    lead.assignedTo = newUser._id;
    lead.team = newUser.team;

    lead.assignmentHistory.push({
      user: newUser._id,
      assignedAt: new Date(),
      reassignedBy: req.user._id
    });

    await lead.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "🚀 Lead reassigned successfully",
      data: lead
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { reassignLead };