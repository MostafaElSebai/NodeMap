import { CustomAPIError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const checkConnectionOwnership = (connUserId, userId, connBoardId, boardId) => {

    if (connUserId.toString() !== userId) {
        throw new CustomAPIError("You are not authorized to perform this action", StatusCodes.UNAUTHORIZED)
    }

    if (connBoardId.toString() !== boardId) {
        throw new CustomAPIError("Connection doesn't belong to this board", StatusCodes.FORBIDDEN)
    }

    return;

}