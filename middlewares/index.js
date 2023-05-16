const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const config = require("../app/config");
const User = require("../app/v1/user/model");

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) {
        return next();
      }

      req.user = jwt.verify(token, config?.secretKey);

      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        res.json({
          error: 1,
          message: `Token Expired`,
        });
      }
    } catch (error) {
      if (error && error.name === "JsonWebTokenError") {
        return res.status(400).json({
          error: 1,
          message: error.message,
        });
      }
      next(error);
    }
    return next();
  };
}

const policies_check = (action, subject) => {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.status(400).json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }
    return next();
  };
};

module.exports = { decodeToken, policies_check };
