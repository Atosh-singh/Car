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

const overview = async (req, res) => {
  try {
    const { period = "monthly", team = "all", status = "all" } = req.query;

    const cacheKey = buildCacheKey("dashboard:overview", req);

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Overview from cache");
      return res.status(200).json(JSON.parse(cached));
    }

    const data = await dashboardService.getOverview({
      period,
      team,
      status,
      user: req.user
    });

    const result = {
      success: true,
      data
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Overview Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch overview"
    });
  }
};

module.exports = { overview };