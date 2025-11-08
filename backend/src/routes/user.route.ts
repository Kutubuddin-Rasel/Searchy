import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { loginUser, logOut, registerUser } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import uniqueEmail from "../auth/uniqueEmail.js";

const router = Router();

router.route("/register").post(upload.single('avatar'),registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logOut)
router.route("/unique-email").get(uniqueEmail)

export default router;