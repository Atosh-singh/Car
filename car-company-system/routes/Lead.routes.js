const express = require("express");
const router = express.Router();

const {
  getLead,
  removeLead,
  toggleLeadStatus,
  updateLead,
} = require("../controllers/lead");

const authMiddleware = require("../middlewares/auth.middleware");

// Protect all CRM routes
router.use(authMiddleware);

router.get("/", getLead);
router.put("/:id", updateLead);
router.delete("/:id", removeLead);
router.patch("/toggle/:id", toggleLeadStatus);

module.exports = router;
