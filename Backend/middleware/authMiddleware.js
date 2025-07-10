import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token!", ok: false });
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
      if (error)
        return res.status(403).json({ message: "Invalid token", ok: false });
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token", ok: false });
  }
}
export function checkRole(requiredRole) {
  return function (req, res, next) {
    if (req.user.role !== requiredRole) {
      return res
        .status(403)
        .json({ message: "You are not permitted", ok: false });
    }
    next();
  };
}
