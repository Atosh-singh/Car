const { Lead } = require("../../models/Lead");

const getLead = async (req, res) => {

  let filter = { removed: false };

  if (req.user.permissions.includes("lead.view.all")) {
    // Admin sees all
  }

  else if (req.user.permissions.includes("lead.view.team")) {
    filter.team = req.user.team;
  }

  else if (req.user.permissions.includes("lead.view.own")) {
    filter.assignedTo = req.user._id;
  }

  else {
    return res.status(403).json({ message: "Access denied" });
  }

  const leads = await Lead.find(filter)
    .populate("assignedTo", "name email")
    .populate("team", "name")
    .populate("car", "name");

  res.json(leads);
};

module.exports = { getLead };
