const { Role } = require("../../models/Role");

const createRole = async (req, res) => {
  const { name, description, permissions } = req.body;

  const existing = await Role.findOne({ name });

  if (existing) {
    return res.status(409).json({ message: "Role already exists" });
  }

  const role = await Role.create({
    name,
    description,
    permissions
  });

  res.status(201).json(role);
};

module.exports = { createRole };
