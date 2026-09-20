import { CustomAPIError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";
import { Node } from "../models/nodesModel.js";

export const checkNodesExistInBoard = async (source, target, boardId) => {
    const sourceDB = await Node.findOne({ _id: source })
    const targetDB = await Node.findOne({ _id: target })
    if (!sourceDB || !targetDB) {
        throw new CustomAPIError("Node not found", StatusCodes.NOT_FOUND)
    }
    if (sourceDB.boardId.toString() !== boardId || targetDB.boardId.toString() !== boardId) {
        throw new CustomAPIError("Node doesn't belong to this board", StatusCodes.NOT_FOUND)
    }
}