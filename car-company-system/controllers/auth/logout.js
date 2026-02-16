const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    res.clearCookie("carcrm.sid");

    res.status(200).json({
      message: "✅ Logout successful",
    });
  });
};

module.exports = { logout };
