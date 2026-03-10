const { User } = require("../../models/User");

const getUsers = async (req, res) => {

  const users = await User.find({ removed: false })
    .populate("role")
    .populate("team");

  res.json(users);
};

module.exports = { getUsers };
