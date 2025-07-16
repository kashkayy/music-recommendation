import express from "express";
import { authorizeAccess, authenticateToken } from "../middleware/authMiddleware.js";
import {
  getTopTrendingSongs,
  getTopUsers,
  toggleAdmin,
  toggleBan,
} from "../controllers.js";
import { Role } from "../generated/prisma/index.js";
import { getAllUsers, getAllSongs} from "../controllers/adminControllers.js";
import { badReq, successRes } from "../utils/Response.js";
const router = express.Router();
router.get("/", authenticateToken, (req, res) => {
  res.json({ isAdmin: (req.user.role === Role.admin || req.user.role === Role.regionAdmin)});
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
  "/top/songs",
  authenticateToken,
  async (req, res) => {
    try {
      const trending = await getTopTrendingSongs();
      res
        .status(200)
        .json({
          message: "Successfully fetched top 10",
          results: trending,
          ok: true,
        });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching top 10 trending songs", ok: false });
    }
  },
);
router.get(
  "/top/users",
  authenticateToken,
  async (req, res) => {
    try {
      const users = await getTopUsers();
      res
        .status(200)
        .json({
          message: "Successfully fetched top users",
          results: users,
          ok: true,
        });
    } catch (err) {
      res.status(500).json({ message: "Error fetching top users", ok: false });
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
  "/:userId/ban-action",
  authenticateToken,
  async (req, res) => {
    const { userId } = req.params;
    try {
      await toggleBan(userId);
      const updated = await getAllUsers();
      res
        .status(200)
        .json({
          message: "Successfully changed status",
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
export default router;
