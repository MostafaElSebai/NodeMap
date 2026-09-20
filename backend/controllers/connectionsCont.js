import express from "express";
import { Connection } from "../models/connectionsModel.js";
import { Node } from "../models/nodesModel.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/customError.js";
import { createGroupId, checkConnectionOwnership, checkNodesExistInBoard } from "../utils/index.js";
import { connections } from "mongoose";

const router = express.Router();

export const getConnections = async (req, res) => {

    const { boardId } = req.params;
    const { userId } = req.user;

    const connections = await Connection.find({ boardId, userId })

    res.status(StatusCodes.OK).json({ connections })
}

export const createConnection = async (req, res) => {
    const { boardId } = req.params;
    const { userId } = req.user;
    const { source, target, connectionType, connectionName } = req.body



    if (!source || !target || !connectionType || !connectionName) {
        throw new CustomAPIError("Missing required fields", StatusCodes.BAD_REQUEST)
    }

    //check that nodes exist and belong to the same board
    await checkNodesExistInBoard(source, target, boardId)


    const searchConnectionName = connectionName.toLowerCase();

    if (connectionType === "non-directional") {
        const groupId = createGroupId(source, target)

        const connections = await Connection.create([{
            source,
            target,
            connectionType,
            connectionName,
            searchConnectionName,
            groupId,
            boardId,
            userId
        }, {
            source: target,
            target: source,
            connectionType,
            connectionName,
            searchConnectionName,
            groupId,
            boardId,
            userId
        }]);

        return res.status(StatusCodes.CREATED).json(connections[0]);

    } else {
        const connection = await Connection.create({
            source,
            target,
            connectionType,
            connectionName,
            searchConnectionName,
            boardId,
            userId
        })

        return res.status(StatusCodes.CREATED).json(connection);
    }

}

export const updateConnection = async (req, res) => {
    const { boardId, connectionId } = req.params;
    const { userId } = req.user;
    const { connectionType, connectionName } = req.body

    const connection = await Connection.findOne({ _id: connectionId })
    if (!connection) {
        throw new CustomAPIError("Connection not found", StatusCodes.NOT_FOUND)
    }
    const source = connection.source;
    const target = connection.target;
    console.log(connection, "Before update");


    checkConnectionOwnership(connection.userId, userId, connection.boardId, boardId);
    const searchConnectionName = connectionName.toLowerCase();


    if (connectionType !== connection.connectionType) {
        // if non-directional update current one and create reverse connection with groupId
        if (connectionType === "non-directional") {

            const groupId = createGroupId(source, target)

            connection.connectionName = connectionName;
            connection.connectionType = connectionType;
            connection.searchConnectionName = searchConnectionName;
            connection.groupId = groupId;

            await connection.save();

            const reverseConnection = await Connection.create({
                source: target,
                target: source,
                connectionType,
                connectionName,
                searchConnectionName,
                groupId,
                boardId,
                userId
            })

            return res.status(StatusCodes.OK).json(connection)

        } else {

            //if directional update the current connection and delete reverse connection
            connection.connectionType = connectionType;
            connection.connectionName = connectionName;
            connection.searchConnectionName = searchConnectionName;
            connection.groupId = undefined;
            await connection.save();

            console.log(connection, "After update");


            await Connection.findOneAndDelete({ source: target, target: source });


            return res.status(StatusCodes.OK).json(connection)
        }
        //if update doesn't change connection type just update connection name and search connection name
    } else {

        connection.connectionName = connectionName;
        connection.searchConnectionName = searchConnectionName;
        await connection.save()

        return res.status(StatusCodes.OK).json(connection)

    }

}

export const deleteConnection = async (req, res) => {
    const { boardId } = req.params;
    const { userId } = req.user;
    const { connectionId } = req.params;

    const connection = await Connection.findOne({ _id: connectionId })
    if (!connection) {
        throw new CustomAPIError("Connection not found", StatusCodes.NOT_FOUND)
    }

    checkConnectionOwnership(connection.userId, userId, connection.boardId, boardId);

    if (connection.groupId) {
        await Connection.deleteMany({ groupId: connection.groupId })
    } else {
        await connection.deleteOne();
    }



    res.status(StatusCodes.OK).json({ message: "Connection deleted successfully" })
}

export default router