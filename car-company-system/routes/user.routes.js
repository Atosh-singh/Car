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

router.post("/", createUser);
router.get("/", getUsers);
router.put("/:id", updateUser);



router.delete("/:id", deleteUser);

router.post("/change-password", changePassword);
router.post("/admin-reset-password", adminResetPassword);

module.exports = router;

