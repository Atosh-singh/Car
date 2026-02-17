const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Check Authorization header
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized - No token provided"
      });
    }

    // 2️⃣ Extract token
    const token = header.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token"
      });
    }

    // 4️⃣ Check user from DB
    const user = await User.findOne({
      _id: decoded.id,
      removed: false,
      enabled: true
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized - User not active"
      });
    }

    // ✅ IMPORTANT: Consistent structure
    req.user = {
      id: user._id
    };

    next();

  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

module.exports = authMiddleware;
