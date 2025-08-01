import express from "express";
import {
  getUserRecommendations,
  getHybridRecommendations,
} from "../controllers/recommendationControllers.js";
import { badReq, successRes } from "../utils/Response.js";
import { parseObj } from "../utils/ParseObj.js";
import { getSvdResults } from "../controllers/svdControllers.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();
router.get("/", async (req, res) => {
  const parsedObj = parseObj(req.query);
  if (!parsedObj) {
    return res.status(400).json(badReq("Invalid Query"));
  }
  try {
    const results = await getUserRecommendations(parsedObj);
    res.status(200).json(successRes(results));
  } catch (error) {
    res.status(500).json(badReq("Error processing request"));
  }
});
router.get("/svd", authenticateToken, async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json(badReq("Invalid id"));
  }
  try {
    const results = await getSvdResults(parseInt(userId));
    res.status(200).json(successRes(results));
  } catch (error) {
    res.status(500).json(badReq("Error processing request"));
  }
});

router.get("/hybrid", authenticateToken, async (req, res) => {
  const parsedObj = parseObj(req.query);
  if (!parsedObj) {
    return res.status(400).json(badReq("Invalid Query"));
  }
  try {
    const results = await getHybridRecommendations(parsedObj);
    res.status(200).json(successRes(results));
  } catch (error) {
    res.status(500).json(badReq("Error processing hybrid recommendations"));
  }
});
export default router;
