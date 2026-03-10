const { Role } = require("../../models/Role");
const { Permission } = require("../../models/Permission");

const updateRole = async (req, res) => {

  const { name, description, permissions } = req.body;

  const role = await Role.findById(req.params.id);

  if (!role) {
    return res.status(404).json({ message: "Role not found" });
  }

  // Optional: prevent editing Admin role
  if (role.name === "Admin") {
    return res.status(403).json({
      message: "Admin role cannot be modified"
    });
  }

  // Validate permissions if provided
  if (permissions) {

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        message: "Permissions must be an array"
      });
    }

    // Optional: validate against Permission collection
    const validPermissions = await Permission.find({
      name: { $in: permissions }
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({
        message: "Invalid permissions detected"
      });
    }

    role.permissions = permissions;
  }

  if (name) role.name = name;
  if (description) role.description = description;

  await role.save();

  res.json(role);
};

module.exports = { updateRole };
