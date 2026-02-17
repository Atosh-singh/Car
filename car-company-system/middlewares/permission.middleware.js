const { User } = require("../models/User");

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {

      // 1️⃣ Ensure user authenticated
      if (!req.user?.id) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      // 2️⃣ Get user with role
      const user = await User.findById(req.user.id)
        .populate("role");

      if (!user || user.removed || !user.enabled) {
        return res.status(401).json({
          message: "User not active"
        });
      }

      if (!user.role || user.role.removed || !user.role.enabled) {
        return res.status(403).json({
          message: "Role not active"
        });
      }

      const permissions = user.role.permissions || [];

      // 3️⃣ SUPER ADMIN shortcut
      if (permissions.includes("ALL_ACCESS")) {
        return next();
      }

      // 4️⃣ Required permission check
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          message: "Access Denied"
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
