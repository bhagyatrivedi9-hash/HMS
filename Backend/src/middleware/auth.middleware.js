import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

/**
 * protect — verifies the Bearer token in the Authorization header.
 * On success, attaches the decoded payload to `req.user` and calls next().
 * On failure, responds with 401.
 */
export const protect = (req, res, next) => {
  // 1️⃣  Prefer the httpOnly cookie (browser clients)
  // 2️⃣  Fall back to Authorization: Bearer <token> (API / mobile clients)
  let token = req.cookies?.token;

  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication required. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, iat, exp }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

/**
 * authorise — restricts access to specific roles.
 * Must be used AFTER the `protect` middleware.
 *
 * Usage: router.delete("/user/:id", protect, authorise("admin"), deleteUser);
 *
 * @param {...string} roles - Allowed roles
 */
export const authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${roles.join(", ")}.`,
      });
    }
    next();
  };
};

export const authorisDoctor = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole === "doctor") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Required role: doctor.",
    });
  }
}

export const authorisStaff = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole === "staff") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Required role: staff.",
    });
  }
}

export const authorisAdmin = (req, res, next) => {
  const userRole = req.user.role;
  if (userRole === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied. Required role: admin.",
    });
  }
}