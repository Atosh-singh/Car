const dashboardService = require("../../services/dashboard.service");
const redis = require("../../config/redis");

const buildCacheKey = (baseKey, req) => {
  const role = req.user?.role || "guest";
  const userId = req.user?.id || req.user?._id || "anonymous";
  const team = req.query.team || "all";
  const status = req.query.status || "all";

  return `${baseKey}:role=${role}:user=${userId}:team=${team}:status=${status}`;
};

const monthLeads = async (req, res) => {
  try {
    const { team = "all", status = "all" } = req.query;

    const cacheKey = buildCacheKey("dashboard:monthLeads", req);

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("⚡ Month leads from cache");
      return res.status(200).json(JSON.parse(cached));
    }

    const count = await dashboardService.getMonthLeads({
      team,
      status,
      user: req.user
    });

    const result = {
      success: true,
      data: {
        monthLeads: count
      }
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 60);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Month Leads Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch month leads"
    });
  }
};

module.exports = { monthLeads };