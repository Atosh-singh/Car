const bcrypt = require("bcrypt");
const { User } = require("../../models/User");

const adminResetPassword = async (req, res) => {

  const { newPassword } = req.body;

  const user = await User.findById(req.params.id);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password reset by admin" });
};

module.exports = { adminResetPassword };
