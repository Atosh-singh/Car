const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");
const { createLead } = require("../controllers/lead");

const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests. Try again later."
});

// PUBLIC LANDING ROUTE
router.post("/lead", leadLimiter, createLead);

module.exports = router;
