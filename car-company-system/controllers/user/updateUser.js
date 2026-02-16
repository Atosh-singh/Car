const { User } = require("../../models/User");

const updateUser = async (req, res) => {

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, removed: false },
    req.body,
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

module.exports = { updateUser };
