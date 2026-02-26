const dashboardService = require("../../services/dashboard.service");

const teamStats = async (req, res) => {
  try {
    const data = await dashboardService.getTeamStats();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { teamStats };