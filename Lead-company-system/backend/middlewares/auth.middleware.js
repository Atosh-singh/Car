const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    const user = await User.findOne({
      _id: decoded.id || decoded._id,
      removed: false,
      enabled: true
    }).populate("role");

    if (!user) {
      return res.status(401).json({ message: "User not active" });
    }

    // 🚀 Attach full context ONCE
    req.user = {
      _id: user._id,
      role: user.role?.name,
      team: user.team,
      permissions: user.role?.permissions || []
    };

    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;