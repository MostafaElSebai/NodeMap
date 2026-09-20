import express from "express";
import {
    getNodes,
    createNode,
    updateNode,
    deleteNode,
    updateNodePosition
} from "../controllers/nodesCont.js"
import { checkUser } from "../middleware/checkUser.js";
import { checkBoardOwnership } from "../middleware/checkBoardOwnership.js";

const router = express.Router({ mergeParams: true });

router.get("/", checkUser, checkBoardOwnership, getNodes);
router.post("/", checkUser, checkBoardOwnership, createNode);
router.patch("/:nodeId", checkUser, checkBoardOwnership, updateNode);
router.patch("/:nodeId/position", checkUser, checkBoardOwnership, updateNodePosition);
router.delete("/:nodeId", checkUser, checkBoardOwnership, deleteNode);

export default router