import express from "express";
import {
  checkRefreshToken,
  checkStatus,
  createUser,
  login,
} from "../controllers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await createUser(username, password);
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser, ok: true });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to create user",
        error: error.message,
        ok: false,
      });
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await login(username, password);
    const status = await checkStatus(username);
    if (!user) {
      res
        .status(401)
        .json({ message: "Incorrect username or password", ok: false });
    } else if (!status) {
      res
        .status(403)
        .json({
          message:
            "You are currently banned and cannot access Sound Map at the time",
          ok: false,
        });
    } else {
      const accessToken = jwt.sign(
        { id: user.id, role: user.role, region: user.region},
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET_REFRESH_KEY,
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
      },
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
      { expiresIn: "1h" },
    );
    res.status(201).json({ message: "Success", token: accessToken, ok: true });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Cannot generate refresh token at the time",
        ok: false,
      });
  }
});
export default router;
