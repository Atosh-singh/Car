const bcrypt = require("bcrypt");
const { User } = require("../../models/User");
const { Role } = require("../../models/Role");

const createUser = async (req, res) => {
  const { name, email, password, role, team } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const roleExist = await Role.findById(role);
  if (!roleExist) {
    return res.status(404).json({ message: "Invalid role" });
  }

  // 🚨 Only one Admin allowed
  if (roleExist.name === "Admin") {
    const adminExists = await User.findOne({ role });
    if (adminExists) {
      return res.status(403).json({
        message: "Admin already exists. Only one admin allowed."
      });
    }
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password: hashed,
    role,
    team
  });

  res.status(201).json({
    message: "User created successfully",
    data: user
  });
};

module.exports = { createUser };
