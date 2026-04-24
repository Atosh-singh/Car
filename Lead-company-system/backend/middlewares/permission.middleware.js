const { User } = require("../models/User");

const permissionMiddleware = (requiredPermission) => {
  return (req, res, next) => {
    try {

      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const roleName = req.user.role?.toUpperCase();

      // 🚀 SUPER ADMIN FULL ACCESS
      if (roleName === "SUPER_ADMIN") return next();

      // 🚀 ADMIN FULL ACCESS
      if (roleName === "ADMIN") return next();

      // 🔐 PERMISSION CHECK
      if (!req.user.permissions?.includes(requiredPermission)) {
        return res.status(403).json({
          message: `Permission '${requiredPermission}' required`
        });
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
