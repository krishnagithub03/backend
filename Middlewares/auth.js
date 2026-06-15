const jwt = require("jsonwebtoken");
const User = require("../Models/Users");

/**
 * Middleware to verify JWT access token from Authorization header.
 * Expects: Authorization: Bearer <token>
 * On success, attaches the user document to req.user and calls next().
 */
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token using the same secret used to sign it in authController
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by phoneNumber (the payload used when signing the token)
    const user = await User.findOne({
      phoneNumber: decoded.phoneNumber,
    }).select("-accessToken");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Attach user to the request object for downstream handlers
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, message: "Token has expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
    return res
      .status(500)
      .json({ success: false, message: "Authentication failed." });
  }
};

/**
 * Middleware factory to authorize based on user role(s).
 * Must be used AFTER verifyToken so that req.user is available.
 * @param  {...string} allowedRoles - One or more roles that are permitted.
 * @returns Express middleware function
 *
 * Usage: authorizeRoles("admin")
 *        authorizeRoles("admin", "doctor")
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires one of the following roles: ${allowedRoles.join(", ")}.`,
      });
    }

    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
