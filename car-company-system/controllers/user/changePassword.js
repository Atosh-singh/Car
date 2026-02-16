// SELF
const bcrypt = require("bcrypt");
const { User } = require("../../models/User");

const changePassword = async (req, res) => {

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  const match = await bcrypt.compare(oldPassword, user.password);

  if (!match) {
    return res.status(401).json({ message: "Old password incorrect" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
};

module.exports = { changePassword };
