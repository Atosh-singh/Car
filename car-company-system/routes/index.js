const express = require("express");
const router = express.Router();

const viewRoutes = require("./view.routes");   // 👈 EJS pages
const publicRoutes = require("./public.routes");

const dashboardRoutes = require("./dashboard.routes"); // 👈 API
const leadRoutes = require("./Lead.routes");
const authRoutes = require("./auth.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");
const permissionRoutes = require("./permission.routes");
const teamRoutes = require("./team.routes");
const carRoutes = require("./car.routes");
const carTypeRoutes = require("./carType.routes");


// ================== VIEW ROUTES FIRST ==================
router.use("/", viewRoutes);   // 👈 IMPORTANT (MUST BE FIRST)


// ================== PUBLIC ROUTES ==================
router.use("/", publicRoutes);


// ================== AUTH ==================
router.use("/auth", authRoutes);


// ================== CRM API ROUTES ==================
router.use("/crm/dashboard", dashboardRoutes);
router.use("/crm/lead", leadRoutes);
router.use("/crm/roles", roleRoutes);
router.use("/crm/users", userRoutes);
router.use("/crm/permissions", permissionRoutes);
router.use("/crm/teams", teamRoutes);
router.use("/crm/cars", carRoutes);
router.use("/crm/car-types", carTypeRoutes);


module.exports = router;