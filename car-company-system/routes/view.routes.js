const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboard/getDashboard");
const { getLead } = require("../controllers/lead/getLead"); // 🔥 IMPORT CONTROLLER


// ======================
// 📊 DASHBOARD VIEW
// ======================
router.get("/crm/dashboard", async (req, res) => {
  try {
    const dashboardData = await getDashboard();

    res.render("crm/dashboard", {
      layout: "layouts/crm",
      title: "Dashboard",
      currentPage: "dashboard",
      user: req.user || { name: "Admin" },
      ...dashboardData
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Dashboard error");
  }
});


// ======================
// 📋 LEADS VIEW
// ======================
router.get("/crm/leads", getLead);  // 🔥 USE CONTROLLER PROPERLY

module.exports = router;