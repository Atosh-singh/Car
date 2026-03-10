const { User } = require("../../models/User");

const deleteUser = async (req, res) => {

  await User.findByIdAndUpdate(req.params.id, {
    removed: true,
    enabled: false
  });

  res.json({ message: "User deleted" });
};

module.exports = { deleteUser };
