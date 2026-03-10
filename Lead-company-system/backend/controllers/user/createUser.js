const bcrypt = require("bcrypt");
const { User } = require("../../models/User");
const { Role } = require("../../models/Role");
const { Team } = require("../../models/Team");

const createUser = async (req, res) => {
  try {
    let { name, email, password, role, team } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const roleDoc = await Role.findById(role);
    if (!roleDoc) {
      return res.status(404).json({
        success: false,
        message: "Invalid role"
      });
    }

    if (team) {
      const teamDoc = await Team.findById(team);
      if (!teamDoc) {
        return res.status(404).json({
          success: false,
          message: "Invalid team"
        });
      }
    }

    if (roleDoc.name === "ADMIN") {
      const adminExists = await User.findOne({ role });
      if (adminExists) {
        return res.status(403).json({
          success: false,
          message: "Only one ADMIN allowed"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,
      role,
      team: team || null
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });

  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createUser };