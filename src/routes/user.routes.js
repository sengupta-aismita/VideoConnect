import {Router} from "express"
import { login } from "../controllers/user.controller.js"
import { register } from "../controllers/user.controller.js"


const router = Router()

router.route("/login").post(login)
router.route("/register").post(register)

export default router