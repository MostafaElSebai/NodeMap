import express from "express";
import { Node } from "../models/nodesModel.js";
import { NodeType } from "../models/nodeTypesModel.js";
import { CustomAPIError } from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const getNodes = async (req, res) => {
    const { _id: boardId } = req.board

    const nodes = await Node.find({ boardId }).populate("category", "name boardId").select("title description")

    res.status(StatusCodes.OK).json(nodes)
}

export const createNode = async (req, res) => {
    const { category, title, description, position } = req.body;
    const { _id: boardId } = req.board

    console.log(req.body);


    if (!category || !title) {
        throw new CustomAPIError("Please provide the needed data", StatusCodes.BAD_REQUEST)
    }

    const searchTitle = title.toLowerCase();

    // const nodeType = await NodeType.findOne({ name: category })

    // if (!nodeType) {
    //     throw new CustomAPIError("Please provide a valid category", StatusCodes.BAD_REQUEST)
    // }

    const node = await Node.create({ category, title, searchTitle, description, boardId, position })
    await node.populate("category", "name _id boardId")


    res.status(StatusCodes.CREATED).json(node)
}

export const updateNode = async (req, res) => {

    const { title, category, description, position } = req.body;
    const { _id: boardId } = req.board
    const { nodeId } = req.params

    const nodeType = await NodeType.findOne({ _id: category })


    if (!nodeType) {
        throw new CustomAPIError("Please provide a valid category", StatusCodes.BAD_REQUEST)
    }


    const searchTitle = title?.toLowerCase();


    const node = await Node.findOneAndUpdate({ _id: nodeId }, { category: nodeType._id, title, searchTitle, description, boardId, position }, { returnDocument: "after", runValidators: true }).populate("category", "name _id boardId")

    if (!node) {
        throw new CustomAPIError("Node not found", StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json(node)
}

export const updateNodePosition = async (req, res) => {

    const { position } = req.body;
    const { _id: boardId } = req.board
    const { nodeId } = req.params


    const node = await Node.findOneAndUpdate({ _id: nodeId }, { position }, { returnDocument: "after", runValidators: true }).populate("category", "name _id boardId")

    if (!node) {
        throw new CustomAPIError("Node not found", StatusCodes.NOT_FOUND)
    }

    res.status(StatusCodes.OK).json(node)
}


export const deleteNode = async (req, res) => {

    const { nodeId } = req.params
    const { _id: boardId } = req.board

    // console.log(boardId);


    const node = await Node.findOneAndDelete({ _id: nodeId, boardId })
    if (!node) {
        throw new CustomAPIError("Node not found", StatusCodes.NOT_FOUND)
    }

    // await node.deleteOne()

    res.status(StatusCodes.OK).json({ msg: "Node deleted successfully" })

}
