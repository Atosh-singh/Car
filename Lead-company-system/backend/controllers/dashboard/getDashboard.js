const dashboardService = require("../../services/dashboard.service");

const getDashboard = async () => {
  const overview = await dashboardService.getOverview();
  const todayLeads = await dashboardService.getTodayLeads();
  const monthLeads = await dashboardService.getMonthLeads();

  return {
    overview,
    todayLeads,
    monthLeads
  };
};

module.exports = { getDashboard };