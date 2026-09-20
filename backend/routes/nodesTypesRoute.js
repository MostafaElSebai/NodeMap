import express from "express";
import {
    getNodeTypes,
    createNodeType,
    deleteNodeType
} from "../controllers/nodesTypesCont.js"
import { checkBoardOwnership } from "../middleware/checkBoardOwnership.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router({ mergeParams: true });

router.get("/", checkUser, checkBoardOwnership, getNodeTypes);
router.post("/", checkUser, checkBoardOwnership, createNodeType);
router.delete("/:nodeTypeId", checkUser, checkBoardOwnership, deleteNodeType);

export default router