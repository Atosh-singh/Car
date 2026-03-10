const express = require("express");
const router = express.Router();

const {
  createPermission,
  getPermissions,
} = require("../controllers/permission");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

router.use(authMiddleware, adminMiddleware);

router.post("/", createPermission);
router.get("/", getPermissions);

module.exports = router;
