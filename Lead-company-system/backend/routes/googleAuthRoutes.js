const express = require("express");
const { oauth2Client } = require("../config/googleAuth");
const { createMeet } = require("../services/googleMeetService");

const router = express.Router();

// 🔹 1. Start Google OAuth
// URL → /api/google/connect
router.get("/connect", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/calendar"],
      prompt: "consent",
    });

    res.redirect(url);
  } catch (error) {
    console.error("Connect Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 🔹 2. Google OAuth Callback
// URL → /api/google/callback
router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    console.log("✅ Tokens:", tokens);

    // 🔥 TEMP FIX (store globally)
    global.googleTokens = tokens;

    res.redirect("http://localhost:5173/google-meet");

  } catch (error) {
    console.error("OAuth Error:", error);
    res.status(500).send("Google Auth Failed");
  }
});
// 🔹 3. Create Google Meet Link
// URL → /api/google/create-meet
router.get("/create-meet", async (req, res) => {
  try {
    if (!global.googleTokens) {
      return res.status(400).json({
        message: "Please connect Google account first",
      });
    }

    oauth2Client.setCredentials(global.googleTokens);

    const link = await createMeet(oauth2Client);

    res.json({ meetLink: link });

  } catch (err) {
    console.error("Create Meet Error:", err);
    res.status(500).json({ message: "Error creating meeting" });
  }
});

module.exports = router;