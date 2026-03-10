const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {overview, teamStats, userStats, todayLeads, monthLeads} = require("../controllers/dashboard/index")

router.use(authMiddleware);

router.get("/overview", overview);
router.get("/team-stats", teamStats);
router.get("/user-stats", userStats);
router.get("/today-leads", todayLeads);
router.get("/month-leads", monthLeads);

module.exports = router;