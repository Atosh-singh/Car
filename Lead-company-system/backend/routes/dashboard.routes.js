const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");
const cache = require("../middlewares/cache.middleware");

// controllers
const {
  getDashboard, // ✅ MAIN API (IMPORTANT)
  overview,
  teamStats,
  userStats,
  todayLeads,
  monthLeads
} = require("../controllers/dashboard");

// 🔐 Protect all routes
router.use(authMiddleware);

// ================= MAIN DASHBOARD =================
router.get(
  "/",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:main"), // 🔥 better key
  getDashboard
);

// ================= OVERVIEW =================
router.get(
  "/overview",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:overview"),
  overview
);

// ================= TEAM STATS =================
router.get(
  "/team-stats",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:teamStats"),
  teamStats
);

// ================= USER STATS =================
router.get(
  "/user-stats",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:userStats"),
  userStats
);

// ================= TODAY LEADS =================
router.get(
  "/today-leads",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:todayLeads"),
  todayLeads
);

// ================= MONTH LEADS =================
router.get(
  "/month-leads",
  permissionMiddleware("VIEW_DASHBOARD"),
  cache(60, "dashboard:monthLeads"),
  monthLeads
);

module.exports = router;