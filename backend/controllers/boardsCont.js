import { Board, Connection, Node, NodeType } from "../models/index.js";
import { shortestPath } from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/customError.js";


export const getBoards = async (req, res) => {
    const { userId } = req.user;

    const boards = await Board.find({ userId })

    if (!boards) {
        throw new CustomAPIError("No boards found", StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json(boards)
}

export const getSingleBoard = async (req, res) => {
    const { boardId } = req.params
    const board = await Board.findOne({ _id: boardId })
    const connections = await Connection.find({ boardId })
    const nodes = await Node.find({ boardId }).populate("category", "name boardId")
    const nodeTypes = await NodeType.find({ boardId })

    res.status(StatusCodes.OK).json({ board, connections, nodes, nodeTypes })
}

export const createBoard = async (req, res) => {
    const { userId } = req.user;
    const { name } = req.body;
    if (!name) {
        throw new CustomAPIError("Board name is required", StatusCodes.BAD_REQUEST)
    }

    const searchName = name.toLowerCase();

    const board = await Board.create({
        name,
        searchName,
        userId
    })

    res.status(StatusCodes.CREATED).json(board)

}

export const updateBoard = async (req, res) => {
    const { boardId } = req.params;
    const { name } = req.body;
    const { userId } = req.user;

    if (!name) {
        throw new CustomAPIError("Board name is required", StatusCodes.BAD_REQUEST)
    }

    const board = await Board.findByIdAndUpdate(boardId, { name }, { returnDocument: "after", runValidators: true })

    if (!board) {
        throw new CustomAPIError("Board not found", StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({ board })
}

export const deleteBoard = async (req, res) => {
    const { _id: boardId } = req.board
    const { userId } = req.user

    const board = await Board.findOneAndDelete({ _id: boardId, userId })
    if (!board) {
        throw new CustomAPIError("Board not found", StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json({ msg: "Board deleted successfully" })
}


export const boardGraphLookup = async (req, res) => {

    const { boardId } = req.params
    const { startNodeId, endNodeId } = req.query


    const board = await Board.findOne({ _id: boardId })

    if (!board) {
        throw new CustomAPIError("Board not found", StatusCodes.NOT_FOUND)
    }

    const data = await board.graphLookUp(boardId, startNodeId)

    const result = shortestPath(data, startNodeId, endNodeId)

    res.status(StatusCodes.OK).json(result)
}