const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/role");

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");

// 🔐 Permission based role management

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("CREATE_ROLE"),
  createRole
);

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("VIEW_ROLE"),
  getRoles
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("UPDATE_ROLE"),
  updateRole
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("DELETE_ROLE"),
  deleteRole
);

module.exports = router;
