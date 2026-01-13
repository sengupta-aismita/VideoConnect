import { Router } from "express";

import {
  addToHistory,
  joinMeeting,
  login,
  register,
  getUserHistory,
  createRoom,
  googleAuth,
  refreshAccessToken,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middlewares/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);

router.get("/history", verifyToken, getUserHistory);
router.post("/history/add", verifyToken, addToHistory);

router.post("/create-room", verifyToken, createRoom);
router.post("/join-room", verifyToken, joinMeeting);
router.post("/refresh-token", refreshAccessToken);
router.post("/google", googleAuth);

export default router;
