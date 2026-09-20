import express from "express";
import {
    registerUser,
    registerGuest,
    loginUser,
    logoutUser
} from "../controllers/authCont.js"
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/registerGuest", checkUser, registerGuest);
router.post("/login", loginUser);
router.get("/logout", checkUser, logoutUser);

export default router