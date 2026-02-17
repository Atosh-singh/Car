const express = require("express");
const router = express.Router();

const leadRoutes = require("./Lead.routes");
const authRoutes = require("./auth.routes");
const publicRoutes = require("./public.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");
const permissionRoutes = require('./permission.routes');
const teamRoutes = require("./team.routes");
const carRoutes = require("./car.routes");
const carTypeRoutes = require("./carType.routes");

router.use("/crm/lead", leadRoutes);
router.use("/crm/roles", roleRoutes);
router.use("/crm/users", userRoutes);
router.use("/crm/permissions", permissionRoutes)
router.use("/crm/teams", teamRoutes);
router.use("/crm/cars", carRoutes);
router.use("/crm/car-types", carTypeRoutes);
router.use("/auth", authRoutes);
router.use("/", publicRoutes);

module.exports = router;
