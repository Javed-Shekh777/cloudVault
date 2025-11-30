// middlewares/roles.js
const { ForbiddenError } = require("../errors/AppErrors");

function requireRole(...allowed) {
  return (req, res, next) => {
    const user = req.user;
    if (!user) return next(new ForbiddenError("Not authenticated"));
    if (!allowed.includes(user.role)) return next(new ForbiddenError("Insufficient role"));
    next();
  };
}

module.exports = { requireRole };
