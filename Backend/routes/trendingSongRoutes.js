import express from "express";
import { getTrendingSongs } from "../controllers.js";
import { defaultLat, defaultLng } from "../prisma/seed.js";
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required", ok: false });
    }
    let trendingSongs = await getTrendingSongs(
      parseFloat(lat),
      parseFloat(lng),
    );
    if (trendingSongs.length === 0) {
      trendingSongs = await getTrendingSongs(defaultLat, defaultLng);
    }
    res
      .status(200)
      .json({
        message: "Successfully fetched trending songs",
        results: trendingSongs,
        ok: true,
      });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch songs", ok: false });
  }
});
export default router;
