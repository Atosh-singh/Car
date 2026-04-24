const { TeamMember } = require("../models/TeamMember");

const isTeamLeader = async (req, res, next) => {
  try {

    const userId = req.user._id;
    const teamId = req.body.team || req.params.teamId;

    const member = await TeamMember.findOne({
      user: userId,
      team: teamId,
      roleInTeam: "LEADER"
    });

    if (!member && req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "Only team leader can perform this action"
      });
    }

    next();

  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = isTeamLeader;