const express = require("express");
const router = express.Router();

const leadRoutes = require("./Lead.routes");
const authRoutes = require("./auth.routes");
const publicRoutes = require("./public.routes");
const roleRoutes = require("./role.routes");
const userRoutes = require("./user.routes");

router.use("/crm/lead", leadRoutes);
router.use("/crm/roles", roleRoutes);
router.use("/crm/users", userRoutes);

router.use("/auth", authRoutes);
router.use("/", publicRoutes);

module.exports = router;
