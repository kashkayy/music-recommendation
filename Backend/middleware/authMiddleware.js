import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import  {badReq}  from "../utils/Response.js";
import { Role } from "../generated/prisma/index.js";
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
//Where getResourceRegion represents a controller that returns the region of the selected resource(user or song)
export function authorizeAccess(getResourceRegion){
  return async function (req, res, next) {
    try{
      if (req.user.role === Role.admin) return next()
      if (req.user.role !== Role.regionAdmin){
        return res.status(403).json(badReq("Forbidden: Not an admin"))
      }
      const requiredRegion = await getResourceRegion()
      if (req.user.region !== requiredRegion){
        return res.status(403).json(badReq("Forbidden: region mismatch"))
      }
      return next()
    }catch(error){
      return res.status(500).json(badReq("Authorization Error"))
    }
  }
}
