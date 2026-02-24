const { User } = require("../models/User");

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {

  // 🚀 SUPER ADMIN BYPASS
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    // 🚀 ADMIN FULL ACCESS
    if (req.user.role === "ADMIN") {
      return next();
    }

    // 🔐 Normal Permission Check
    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
      console.error("Permission Middleware Error:", error);
      return res.status(500).json({
        message: "Internal Server Error"
      });
    }
  };
};

module.exports = permissionMiddleware;
