const express = require("express");
const router = express.Router();

const {
  createPermission,
  getPermission,
} = require("../controllers/permission");

router.post("/", createPermission);
router.get("/", getPermission);

module.exports = router;
