const { Role } = require("../../models/Role");

const getRoles = async (req, res) => {
  const roles = await Role.find({ removed: false });
  res.json(roles);
};

module.exports = { getRoles };
