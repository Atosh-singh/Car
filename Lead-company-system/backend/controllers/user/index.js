const { createUser } = require("./createUser");
const { getUsers } = require("./getUser");
const { updateUser } = require("./updateUser");
const { deleteUser } = require("./deleteUser");
const { changePassword } = require("./changePassword");
const { adminResetPassword } = require("./adminResetPassword");

module.exports = {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  changePassword,
  adminResetPassword,
};
