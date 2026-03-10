const { Permission } = require("../../models/Permission");

const createPermission = async (req, res) => {

  const { name, description } = req.body;

  const existing = await Permission.findOne({ name });

  if (existing) {
    return res.status(409).json({ message: "Permission exists" });
  }

  const permission = await Permission.create({
    name,
    description
  });

  res.status(201).json(permission);
};

module.exports = { createPermission };
