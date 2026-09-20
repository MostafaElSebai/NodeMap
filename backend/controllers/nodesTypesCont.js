import { NodeType } from "../models/nodeTypesModel.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/customError.js";

export const getNodeTypes = async (req, res) => {
    const { boardId } = req.params;

    const nodeTypes = await NodeType.find({ boardId });
    res.status(StatusCodes.OK).json({ nodeTypes });
}

export const createNodeType = async (req, res) => {
    const { name } = req.body;
    const { boardId } = req.params;

    if (!name) {
        throw new CustomAPIError("Please provide a name", StatusCodes.BAD_REQUEST)
    }

    const nodeType = await NodeType.create({ name, boardId });
    res.status(StatusCodes.CREATED).json(nodeType);
}

export const deleteNodeType = async (req, res) => {
    const { nodeTypeId } = req.params;

    await NodeType.findByIdAndDelete(nodeTypeId);

    res.status(StatusCodes.OK).json({ msg: "Node type deleted" });
}

