const dashboardService = require("../../services/dashboard.service");

const monthLeads = async (req, res) => {
  try {
    const count = await dashboardService.getMonthLeads();

    res.status(200).json({
      success: true,
      monthLeads: count
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { monthLeads };