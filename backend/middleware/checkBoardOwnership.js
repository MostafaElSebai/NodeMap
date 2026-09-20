import { Board } from "../models/boardsModel.js";
import { CustomAPIError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const checkBoardOwnership = async (req, res, next) => {

    const { userId } = req.user;
    const { boardId } = req.params;

    const board = await Board.findOne({ _id: boardId })


    if (!board) {
        throw new CustomAPIError("Board not found", StatusCodes.NOT_FOUND)
    }

    if (board.userId.toString() !== userId) {
        throw new CustomAPIError("You are not authorized to perform this action", StatusCodes.UNAUTHORIZED)
    }

    req.board = board

    next()
}