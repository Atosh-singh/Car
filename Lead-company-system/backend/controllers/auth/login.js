const bcrypt = require("bcrypt");
const { User } = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../../utils/token");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    // 🔒 Only active users can login
    const user = await User.findOne({
      email,
      removed: false,
      enabled: true
    }).populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found or disabled"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = { login };
