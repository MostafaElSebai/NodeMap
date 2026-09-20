import express from "express";
import {
    getConnections,
    createConnection,
    updateConnection,
    deleteConnection
} from "../controllers/connectionsCont.js"
import { checkUser } from "../middleware/checkUser.js";
import { checkBoardOwnership } from "../middleware/checkBoardOwnership.js";

const router = express.Router({ mergeParams: true });

router.get("/", checkUser, checkBoardOwnership, getConnections);
router.post("/", checkUser, checkBoardOwnership, createConnection);
router.patch("/:connectionId", checkUser, checkBoardOwnership, updateConnection);
router.delete("/:connectionId", checkUser, checkBoardOwnership, deleteConnection);

export default router