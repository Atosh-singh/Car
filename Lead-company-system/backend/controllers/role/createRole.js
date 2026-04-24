const { Role } = require("../../models/Role");
const { Permission } = require("../../models/Permission");
const { clearCache } = require("../../utils/cacheInvalidator");

const createRole = async (req, res) => {
  try {
    let { name, description, permissions } = req.body;

    // ✅ Validation
    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        message: "Name and permissions are required"
      });
    }

    // 🔧 Normalize
    name = name.trim().toUpperCase();
    permissions = permissions.map(p => p.trim().toUpperCase());

    // ✅ Check role exists
    const existing = await Role.findOne({ name });

    if (existing) {
      return res.status(409).json({
        message: "Role already exists"
      });
    }

    // ✅ Validate permissions by NAME (FIXED 🔥)
    const validPermissions = await Permission.find({
      name: { $in: permissions }
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({
        message: "One or more permissions are invalid"
      });
    }

    // ✅ Create role
    const role = await Role.create({
      name,
      description,
      permissions // ✅ store as STRING ARRAY
    });

    await clearCache("roles");
    await clearCache("users");

    return res.status(201).json(role);

  } catch (error) {
    console.error("Create Role Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { createRole };