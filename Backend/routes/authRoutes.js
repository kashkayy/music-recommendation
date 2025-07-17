import express from "express";
import { checkRefreshToken, createUser, login } from "../controllers.js";
import { checkStatus } from "../controllers/authControllers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { badReq, successRes } from "../utils/Response.js";
dotenv.config();
const router = express.Router();
router.post("/signup", async (req, res) => {
  const { username, password, userLat, userLng } = req.body;
  try {
    const newUser = await createUser(username, password, userLat, userLng);
    res.status(201).json(successRes(newUser));
  } catch (error) {
    res.status(500).json(badReq("Failed to create user"));
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);
    const status = await checkStatus(username);
    if (!user) {
      res.status(401).json(badReq("Incorrect username or password"));
    } else if (!status) {
      res
        .status(403)
        .json(badReq(`${username} is banned from Sound Map at the time`));
    } else {
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role,
          region: user.region,
          isBanned: user.isBanned,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET_REFRESH_KEY
      );
      res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(201)
        .json({ message: "Log in successful!", token: accessToken, ok: true });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Log in failed", error: error.message, ok: false });
  }
});
router.get("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized", ok: false });
    }
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_KEY,
      (error, user) => {
        if (error)
          return res.status(403).json({ message: "Forbidden", ok: false });
        req.user = user;
      }
    );
    const userId = user.id;
    const authorized = await checkRefreshToken(userId, refreshToken);
    if (!authorized) {
      return res
        .status(401)
        .json({ message: "Refresh token does not exist", ok: false });
    }
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "Success", token: accessToken, ok: true });
  } catch (err) {
    res.status(500).json({
      message: "Cannot generate refresh token at the time",
      ok: false,
    });
  }
});
export default router;
