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

// Protect all CRM routes
router.use(authMiddleware);

router.get("/", getLead);
router.put("/:id", updateLead);
router.delete("/:id", removeLead);
router.patch("/toggle/:id", toggleLeadStatus);
router.put("/:id/status", authMiddleware, updateLeadStatus);
router.put("/:id/assign", authMiddleware, assignLead);

module.exports = router;
