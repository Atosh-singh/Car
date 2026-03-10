
const express = require("express");
const router = express.Router();

const {
  getLead,
  removeLead,
  toggleLeadStatus,
  updateLead,
  updateLeadStatus,
  assignLead
} = require("../controllers/lead");

const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", getLead);

router.put("/:id/status", updateLeadStatus);

router.put("/:id", updateLead);
router.delete("/:id", removeLead);
router.patch("/toggle/:id", toggleLeadStatus);

router.put("/:id/assign", assignLead);

module.exports = router;
