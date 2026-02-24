const { Lead } = require("../../models/Lead");

const getLead = async (req, res) => {
  try {

    const { page = 1, limit = 10 } = req.query;
    let filter = { removed: false };

    // 🚀 SUPER ADMIN & ADMIN → See All
    if (req.user.role === "SUPER_ADMIN" || req.user.role === "ADMIN") {
      // no filter
    }

    else if (req.user.permissions.includes("LEAD_VIEW_TEAM")) {
      filter.team = req.user.team;
    }

    else if (req.user.permissions.includes("LEAD_VIEW_OWN")) {
      filter.assignedTo = req.user._id;
    }

    else {
      return res.status(403).json({ message: "Access denied" });
    }

    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate("assignedTo", "name email")
        .populate("team", "name")
        .populate("car", "name")
        .skip(skip)
        .limit(Number(limit))
        .lean(),

      Lead.countDocuments(filter)
    ]);

    res.json({
      data: leads,
      total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLead };