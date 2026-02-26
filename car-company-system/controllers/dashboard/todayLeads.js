const dashboardService = require("../../services/dashboard.service");

const todayLeads = async (req, res) => {
  try {
    const count = await dashboardService.getTodayLeads();

    res.status(200).json({
      success: true,
      todayLeads: count
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { todayLeads };