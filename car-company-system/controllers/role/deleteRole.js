const { Role } = require("../../models/Role");

const deleteRole = async (req, res) => {

  await Role.findByIdAndUpdate(req.params.id, {
    removed: true,
    enabled: false
  });

  res.json({ message: "Role deleted" });
};

module.exports = { deleteRole };
