import {Router} from "express"
import { addToHistory, joinMeeting, login } from "../controllers/user.controller.js"
import { register } from "../controllers/user.controller.js"
import { getUserHistory } from "../controllers/user.controller.js"
import { createRoom } from "../controllers/user.controller.js"
import { verifyToken } from "../middlewares/auth.js"

const router = Router()

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/history").get(verifyToken, getUserHistory);
router.route("/history/add").post(verifyToken, addToHistory);
router.route("/create-room").post(verifyToken, createRoom);
router.route("/join-room").post(verifyToken, joinMeeting);

export default router