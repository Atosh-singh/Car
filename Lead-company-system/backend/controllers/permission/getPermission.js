const { Permission } = require("../../models/Permission");

const getPermissions = async (req, res) => {
  const permissions = await Permission.find();
  res.json(permissions);
};

module.exports = { getPermissions };
