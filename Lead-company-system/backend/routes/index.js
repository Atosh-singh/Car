const express = require("express");
const router = express.Router();

const publicRoutes = require("./public.routes");

const dashboardRoutes = require("./dashboard.routes");
const leadRoutes = require("./Lead.routes");
const authRoutes = require("./auth.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");
const permissionRoutes = require("./permission.routes");
const teamRoutes = require("./team.routes");
const carRoutes = require("./car.routes");
const carTypeRoutes = require("./carType.routes");
const googleAuthRoutes = require("./googleAuthRoutes");

router.use("/public", publicRoutes);

router.use("/auth", authRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/leads", leadRoutes);

router.use("/roles", roleRoutes);

router.use("/users", userRoutes);

router.use("/permissions", permissionRoutes);

router.use("/teams", teamRoutes);

router.use("/cars", carRoutes);

router.use("/car-types", carTypeRoutes);

router.use("/google", googleAuthRoutes);

module.exports = router;