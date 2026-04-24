const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findOne({
      _id: decoded.id || decoded._id,
      removed: false,
      enabled: true
    }).populate("role");

    if (!user) {
      return next(new Error("User not active"));
    }

    // ✅ SAME STRUCTURE AS req.user
   socket.user = {
  id: user._id.toString(),

  role: decoded.role || user.role?.name,
  permissions: decoded.permissions || user.role?.permissions || [],

  team: user.team
};

    next();

  } catch (err) {
    next(new Error("Unauthorized"));
  }
};

module.exports = socketAuthMiddleware;