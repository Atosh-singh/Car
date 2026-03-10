const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
  adminResetPassword,
} = require("../controllers/user");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// 🔐 Admin-only routes
router.use(authMiddleware, adminMiddleware);

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// 👤 User self password change (only logged-in user)
router.post("/change-password", authMiddleware, changePassword);

// 👑 Admin reset any user's password
router.post("/admin-reset-password", adminMiddleware, adminResetPassword);

module.exports = router;
