const dashboardService = require("../../services/dashboard.service");

const userStats = async (req, res) => {
  try {
    const data = await dashboardService.getUserStats();

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

module.exports = { userStats };