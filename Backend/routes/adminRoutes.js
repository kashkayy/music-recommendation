import express from "express";
import { authorizeAccess, authenticateToken } from "../middleware/authMiddleware.js";
import {
  toggleAdmin,
} from "../controllers.js";
import { Role } from "../generated/prisma/index.js";
import { getAllUsers, getAllSongs, getTopSongs, getTopUsers, getUserRegion, updateBanStatus } from "../controllers/adminControllers.js";
import { badReq, successRes } from "../utils/Response.js";
const router = express.Router();
router.get("/", authenticateToken, (req, res) => {
  res.json({ isAdmin: (req.user.role === Role.admin || req.user.role === Role.regionAdmin) });
});
router.get(
  "/users",
  authenticateToken,
  async (req, res) => {
    const userRole = req.user.role
    const adminRegion = req.user.region
    try {
      const users = await getAllUsers(adminRegion, userRole);
      res
        .status(200)
        .json(successRes(users));
    } catch (err) {
      res.status(500).json(badReq());
    }
  },
);
router.get(
  "/songs",
  authenticateToken,
  async (req, res) => {
    const userRole = req.user.role
    const adminRegion = req.user.region
    try {
      const songs = await getAllSongs(adminRegion, userRole);
      res
        .status(200)
        .json(successRes(songs));
    } catch (err) {
      res.status(500).json(badReq());
    }
  },
);
router.get(
  "/top/saved-songs",
  authenticateToken,
  async (req, res) => {
    const adminRegion = req.user.region
    const userRole = req.user.role
    try {
      const trending = await getTopSongs(adminRegion, userRole);
      res
        .status(200)
        .json(successRes(trending));
    } catch (err) {
      res
        .status(500)
        .json(badReq("Error fetching top saved songs"));
    }
  },
);
router.get(
  "/top/active-users",
  authenticateToken,
  async (req, res) => {
    const adminRegion = req.user.region
    const userRole = req.user.role
    try {
      const users = await getTopUsers(adminRegion, userRole);
      res
        .status(200)
        .json(successRes(users));
    } catch (err) {
      res.status(500).json(badReq("Error fetching top active users"));
    }
  },
);
router.put(
  "/:userId/role-action",
  authenticateToken,
  async (req, res) => {
    const { userId } = req.params;
    try {
      await toggleAdmin(userId);
      const updated = await getAllUsers();
      res
        .status(200)
        .json({
          message: "Successfully changed role",
          results: updated,
          ok: true,
        });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Cannot perform action at this time", ok: false });
    }
  },
);
router.put(
  "/ban/:userId",
  authenticateToken,
  authorizeAccess((req) => getUserRegion(req.params.userId)),
  async (req, res) => {
    const { userId } = req.params;
    const { newStatus } = req.body
    const userRole = req.user.role
    try {
      const user = await updateBanStatus(userId, newStatus, userRole);
      res
        .status(200)
        .json(successRes(user));
    } catch (err) {
      res
        .status(500)
        .json(badReq("Cannot perform ban-action at this time"));
    }
  },
);
export default router;
