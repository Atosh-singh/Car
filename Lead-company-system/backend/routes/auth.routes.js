const express = require("express");
const router = express.Router();

const { login, logout } = require("../controllers/auth/index");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/logout", authMiddleware, logout);

module.exports = router;
