const { User } = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {

    // 1️⃣ Ensure authenticated
    if (!req.user?.id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // 2️⃣ Fetch user with role
    const user = await User.findById(req.user.id)
      .select("role removed enabled")
      .populate("role", "name removed enabled")
      .lean();

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

    const roleName = user.role.name?.toUpperCase();

    // 3️⃣ Only ADMIN or SUPER_ADMIN allowed
    if (roleName === "SUPER_ADMIN" || roleName === "ADMIN") {
      return next();
    }

    return res.status(403).json({
      message: "Access denied. Admin only."
    });

  } catch (error) {
    console.error("Admin Middleware Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = adminMiddleware;
