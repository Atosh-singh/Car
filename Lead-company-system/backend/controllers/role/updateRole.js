const { Role } = require("../../models/Role");
const { Permission } = require("../../models/Permission");
const { clearCache } = require("../../utils/cacheInvalidator");

const updateRole = async (req, res) => {
  try {
    let { name, description, permissions } = req.body;

    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // 🔒 Protect system roles
    if (["ADMIN", "SUPER_ADMIN"].includes(role.name)) {
      return res.status(403).json({
        message: "System role cannot be modified"
      });
    }

    // ✅ Update permissions
    if (permissions) {

      if (!Array.isArray(permissions)) {
        return res.status(400).json({
          message: "Permissions must be an array"
        });
      }

      // 🔧 Normalize
      permissions = permissions.map(p => p.trim().toUpperCase());

      // ✅ Validate by NAME (FIXED 🔥)
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

    // ✅ Update other fields
    if (name) role.name = name.trim().toUpperCase();
    if (description) role.description = description;

    await role.save();

    await clearCache("roles");
    await clearCache("users");

    return res.json(role);

  } catch (error) {
    console.error("Update Role Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateRole };