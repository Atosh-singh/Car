const express = require("express");
const router = express.Router();

const {
  createLead,
  getLead,
  removeLead,
  toggleLeadStatus,
  updateLead,
  updateLeadStatus,
  assignLead,
  reassignLead
} = require("../controllers/lead");

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");
const cache = require("../middlewares/cache.middleware");
const isTeamLeader = require("../middlewares/teamLeader.middleware");

router.use(authMiddleware);

router.post("/", permissionMiddleware("CREATE_LEAD"), createLead);

router.get(
  "/",
  permissionMiddleware("VIEW_LEAD"),
  cache(60, "leads"), // ✅ important
  getLead,
);

router.put(
  "/:id/status",
  permissionMiddleware("UPDATE_LEAD_STATUS"),
  updateLeadStatus,
);

router.put("/:id", permissionMiddleware("UPDATE_LEAD"), updateLead);

router.delete("/:id", permissionMiddleware("DELETE_LEAD"), removeLead);

router.patch(
  "/toggle/:id",
  permissionMiddleware("TOGGLE_LEAD"),
  toggleLeadStatus,
);

router.put(
  "/:id/reassign",
  permissionMiddleware("REASSIGN_LEAD"),
  reassignLead
);

// Assign Lead
router.put(
  "/:id/assign",
  permissionMiddleware("ASSIGN_LEAD"),
  isTeamLeader, // 🔥 ADD THIS
  assignLead
);

// Reassign Lead
router.put(
  "/:id/reassign",
  permissionMiddleware("REASSIGN_LEAD"),
  isTeamLeader, // 🔥 ADD THIS
  reassignLead
);

router.put("/:id/assign", permissionMiddleware("ASSIGN_LEAD"), assignLead);

module.exports = router;
