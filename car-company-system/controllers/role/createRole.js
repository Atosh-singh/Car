const { Role } = require("../../models/Role");
const { Permission } = require("../../models/Permission");

const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        message: "Name and permissions are required"
      });
    }

    const existing = await Role.findOne({ name });

    if (existing) {
      return res.status(409).json({
        message: "Role already exists"
      });
    }

    // Optional: Validate permissions exist
    const validPermissions = await Permission.find({
      _id: { $in: permissions }
    });

    if (validPermissions.length !== permissions.length) {
      return res.status(400).json({
        message: "One or more permissions are invalid"
      });
    }

    const role = await Role.create({
      name: name.toUpperCase(),
      description,
      permissions
    });

    return res.status(201).json(role);

  } catch (error) {
    console.error("Create Role Error:", error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};

module.exports = { createRole };
