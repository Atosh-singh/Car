const roleMiddleware = (requiredPermission) => {
  return (req, res, next) => {

    if (!req.user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
