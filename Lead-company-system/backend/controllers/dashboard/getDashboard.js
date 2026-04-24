const dashboardService = require("../../services/dashboard.service");
const redis = require("../../config/redis");

const buildCacheKey = (baseKey, req) => {
  const role = req.user?.role || "guest";
  const userId = req.user?.id || req.user?._id || "anonymous";
  const team = req.query.team || "all";
  const period = req.query.period || "monthly";
  const status = req.query.status || "all";

  return `${baseKey}:role=${role}:user=${userId}:team=${team}:period=${period}:status=${status}`;
};

const getDashboard = async (req, res) => {
  try {
    const { period = "monthly", team = "all", status = "all" } = req.query;

    const cacheKey = buildCacheKey("dashboard:main", req);

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("⚡ Dashboard from cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("📦 Dashboard from DB");

    const [
      overview,
      todayLeads,
      monthLeads,
      teamStats,
      userStats,
      statusStats,
      leadsTrend,
      recentActivities
    ] = await Promise.all([
      dashboardService.getOverview({ period, team, status, user: req.user }),
      dashboardService.getTodayLeads({ team, status, user: req.user }),
      dashboardService.getMonthLeads({ team, status, user: req.user }),
      dashboardService.getTeamStats({ period, team, status, user: req.user }),
      dashboardService.getUserStats({ period, team, status, user: req.user }),
      dashboardService.getStatusStats
        ? dashboardService.getStatusStats({ period, team, status, user: req.user })
        : Promise.resolve([]),
      dashboardService.getLeadsTrend
        ? dashboardService.getLeadsTrend({ period, team, status, user: req.user })
        : Promise.resolve([]),
      dashboardService.getRecentActivities
        ? dashboardService.getRecentActivities({ limit: 10, user: req.user })
        : Promise.resolve([])
    ]);

    const result = {
      success: true,
      data: {
        filters: {
          period,
          team,
          status
        },
        overview: {
          ...overview,
          todayLeads,
          monthLeads
        },
        charts: {
          leadsTrend,
          teamStats,
          userStats,
          statusStats
        },
        recentActivities
      }
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard data"
    });
  }
};

module.exports = { getDashboard };