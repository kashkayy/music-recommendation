import express from "express";
import {
  authorizeAccess,
  authenticateToken,
  validateAdminRole,
} from "../middleware/authMiddleware.js";
import { Role } from "../generated/prisma/index.js";
import {
  getAllUsers,
  getAllSongs,
  getTopSongs,
  getTopUsers,
  getUserRegion,
  updateBanStatus,
  promoteUser,
  getUserRole,
} from "../controllers/adminControllers.js";
import { badReq, successRes } from "../utils/Response.js";
import { canPromote } from "../utils/AdminHelper.js";
const router = express.Router();
router.get("/", authenticateToken, (req, res) => {
  res.json({
    isAdmin: req.user.role === Role.admin || req.user.role === Role.regionAdmin,
  });
});
router.get("/users", authenticateToken, validateAdminRole, async (req, res) => {
  const userRole = req.user.role;
  const adminRegion = req.user.region;
  try {
    const users = await getAllUsers(adminRegion, userRole);
    res.status(200).json(successRes(users));
  } catch (err) {
    res.status(500).json(badReq("Error fetching users"));
  }
});
router.get("/songs", authenticateToken, validateAdminRole, async (req, res) => {
  const userRole = req.user.role;
  const adminRegion = req.user.region;
  try {
    const songs = await getAllSongs(adminRegion, userRole);
    res.status(200).json(successRes(songs));
  } catch (err) {
    res.status(500).json(badReq("Error fetching songs"));
  }
});
router.get(
  "/top/saved-songs",
  authenticateToken,
  validateAdminRole,
  async (req, res) => {
    const adminRegion = req.user.region;
    const userRole = req.user.role;
    try {
      const trending = await getTopSongs(adminRegion, userRole);
      res.status(200).json(successRes(trending));
    } catch (err) {
      res.status(500).json(badReq("Error fetching top saved songs"));
    }
  }
);
router.get(
  "/top/active-users",
  authenticateToken,
  validateAdminRole,
  async (req, res) => {
    const adminRegion = req.user.region;
    const userRole = req.user.role;
    try {
      const users = await getTopUsers(adminRegion, userRole);
      res.status(200).json(successRes(users));
    } catch (err) {
      res.status(500).json(badReq("Error fetching top active users"));
    }
  }
);
router.put(
  "/role-promote/:userId",
  authenticateToken,
  validateAdminRole,
  authorizeAccess((req) => getUserRegion(req.params.userId)),
  async (req, res) => {
    const { userId } = req.params;
    const reqRole = req.user.role;
    const reqRegion = req.user.region;
    const { newRole } = req.body;
    const userRole = await getUserRole(userId);
    const userRegion = await getUserRegion(userId);
    try {
      if (!canPromote(reqRole, userRole, reqRegion, userRegion, newRole)) {
        return res
          .status(403)
          .json(badReq("You are not allowed to promote this user"));
      }
      const user = await promoteUser(userId, newRole);
      res.status(200).json(successRes(user));
    } catch (err) {
      res.status(500).json(badReq("Cannot update user role at the time."));
    }
  }
);
router.put(
  "/ban/:userId",
  authenticateToken,
  validateAdminRole,
  authorizeAccess((req) => getUserRegion(req.params.userId)),
  async (req, res) => {
    const { userId } = req.params;
    const { newStatus } = req.body;
    const userRole = req.user.role;
    try {
      const user = await updateBanStatus(userId, newStatus, userRole);
      res.status(200).json(successRes(user));
    } catch (err) {
      res.status(500).json(badReq("Cannot perform ban-action at this time"));
    }
  }
);
export default router;
