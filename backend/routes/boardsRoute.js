import express from "express";
import {
    getBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    getSingleBoard,
    boardGraphLookup
} from "../controllers/boardsCont.js"
import { checkUser } from "../middleware/checkUser.js";
import { checkBoardOwnership } from "../middleware/checkBoardOwnership.js";

const router = express.Router();

router.get("/", checkUser, getBoards);
router.post("/", checkUser, createBoard);
router.get("/:boardId", checkUser, checkBoardOwnership, getSingleBoard);
router.patch("/:boardId", checkUser, checkBoardOwnership, updateBoard);
router.delete("/:boardId", checkUser, checkBoardOwnership, deleteBoard);
router.get("/:boardId/graph-lookup", checkUser, checkBoardOwnership, boardGraphLookup);
export default router