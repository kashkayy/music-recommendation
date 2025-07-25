import express from "express";
import { getUserRecommendations } from "../controllers/recommendationControllers.js";
import { badReq, successRes } from "../utils/Response.js";
import { parseObj } from "../utils/ParseObj.js";
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
export default router;
