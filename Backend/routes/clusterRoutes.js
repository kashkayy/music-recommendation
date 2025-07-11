import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  getClustersData,
  getTopSongs,
} from "../controllers/clusterControllers.js";
import { parseObj } from "../utils/ParseObj.js";
const router = express.Router();
router.get("/info", authenticateToken, async (req, res) => {
  const parsedObj = parseObj(req.query);
  if (!parsedObj) {
    return res
      .status(400)
      .json({ message: "error processing request", ok: false });
  }
  try {
    const data = await getClustersData(parsedObj);
    res.status(200).json({ results: data, ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message, ok: false });
  }
});
router.get("/songs", authenticateToken, async (req, res) => {
  const parsedObj = parseObj(req.query);
  if (!parsedObj) {
    return res
      .status(400)
      .json({ message: "error processing request", ok: false });
  }
  try {
    const data = await getTopSongs(parsedObj);
    res.status(200).json({ results: data, ok: true });
  } catch (error) {
    res.status(400).json({ error: error.message, ok: false });
  }
});
export default router;
