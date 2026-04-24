const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    // 🔐 VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // 🔎 FIND USER
    const user = await User.findOne({
      _id: decoded.id || decoded._id,
      removed: false,
      enabled: true
    })
      .populate("role")
      .populate("extraTeams")
      .lean(); // 🔥 performance boost

    if (!user) {
      return res.status(401).json({ message: "User not active" });
    }

    // 🚀 CLEAN USER CONTEXT
  req.user = {
  _id: user._id,

  // 🔥 Prefer token → fallback to DB
  role: decoded.role || user.role?.name,
  permissions: decoded.permissions || user.role?.permissions || [],

  team: user.team,
  dataScope: user.dataScope,
  extraTeams: user.extraTeams || [],
  extraUsers: user.extraUsers || []
};

    next();

  } catch (error) {

    console.error("Auth Middleware Error:", error.message); // 🔥 logging

    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

module.exports = authMiddleware;