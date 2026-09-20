import express from "express";
import {
    getUsers,
    updateUser,
    deleteUser,
    showCurrentUser,
} from "../controllers/usersCont.js"
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/showMe", checkUser, showCurrentUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router