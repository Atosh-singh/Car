const express = require("express");
const router = express.Router();

const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/role");

// CREATE
router.post("/", createRole);

// READ
router.get("/", getRoles);

// UPDATE
router.put("/:id", updateRole);

// DELETE
router.delete("/:id", deleteRole);

module.exports = router;
