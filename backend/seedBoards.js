import mongoose from "mongoose";
import { User } from "./models/usersModel.js";
import { Board } from "./models/boardsModel.js";
import { NodeType } from "./models/nodeTypesModel.js";
import { Node } from "./models/nodesModel.js";
import { Connection } from "./models/connectionsModel.js";

const MONGO_URI = "mongodb://127.0.0.1/DCB";

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        // Ensure we have a user
        let user = await User.findOne();
        if (!user) {
            user = await User.create({
                name: "Seed User",
                email: "seed@example.com",
                password: "password123",
                role: "admin"
            });
            console.log("Created seed user.");
        } else {
            console.log(`Using existing user: ${user.name}`);
        }

        // 1 Board
        const boardName = `Seed Board ${Date.now()}`;
        const board = await Board.create({
            name: boardName,
            searchName: boardName.toLowerCase(),
            userId: user._id
        });
        console.log(`Created board: ${board.name}`);

        // Need a Node Type
        const nodeType = await NodeType.create({
            name: "Default Seed Type",
            boardId: board._id
        });
        console.log("Created node type.");

        // 6 Nodes (3 for non-directional, 3 for directional)
        const nodeND1 = await Node.create({
            title: "Non-Directional Node 1",
            searchTitle: "non-directional node 1",
            description: "A node used for non-directional connections",
            type: nodeType._id,
            boardId: board._id
        });
        const nodeND2 = await Node.create({
            title: "Non-Directional Node 2",
            searchTitle: "non-directional node 2",
            description: "A node used for non-directional connections",
            type: nodeType._id,
            boardId: board._id
        });
        const nodeND3 = await Node.create({
            title: "Non-Directional Node 3",
            searchTitle: "non-directional node 3",
            description: "A node used for non-directional connections",
            type: nodeType._id,
            boardId: board._id
        });

        const nodeD1 = await Node.create({
            title: "Directional Node 1",
            searchTitle: "directional node 1",
            description: "A node used for directional connections",
            type: nodeType._id,
            boardId: board._id
        });
        const nodeD2 = await Node.create({
            title: "Directional Node 2",
            searchTitle: "directional node 2",
            description: "A node used for directional connections",
            type: nodeType._id,
            boardId: board._id
        });
        const nodeD3 = await Node.create({
            title: "Directional Node 3",
            searchTitle: "directional node 3",
            description: "A node used for directional connections",
            type: nodeType._id,
            boardId: board._id
        });
        console.log("Created 6 nodes (3 Non-Directional, 3 Directional).");

        // Connections
        // 3 Non-directional connections between ND nodes
        await Connection.create({
            parentNode: nodeND1._id,
            childNode: nodeND2._id,
            connectionType: "non-directional",
            connectionName: "Non-Directional Link A",
            searchConnectionName: "non-directional link a",
            boardId: board._id,
            userId: user._id
        });
        await Connection.create({
            parentNode: nodeND2._id,
            childNode: nodeND3._id,
            connectionType: "non-directional",
            connectionName: "Non-Directional Link B",
            searchConnectionName: "non-directional link b",
            boardId: board._id,
            userId: user._id
        });
        await Connection.create({
            parentNode: nodeND3._id,
            childNode: nodeND1._id,
            connectionType: "non-directional",
            connectionName: "Non-Directional Link C",
            searchConnectionName: "non-directional link c",
            boardId: board._id,
            userId: user._id
        });
        console.log("Created 3 non-directional connections.");

        // 3 Directional connections between D nodes
        await Connection.create({
            parentNode: nodeD1._id,
            childNode: nodeD2._id,
            connectionType: "directional",
            connectionName: "Directional Link from 1 to 2",
            searchConnectionName: "directional link from 1 to 2",
            boardId: board._id,
            userId: user._id
        });
        await Connection.create({
            parentNode: nodeD2._id,
            childNode: nodeD3._id,
            connectionType: "directional",
            connectionName: "Directional Link from 2 to 3",
            searchConnectionName: "directional link from 2 to 3",
            boardId: board._id,
            userId: user._id
        });
        await Connection.create({
            parentNode: nodeD3._id,
            childNode: nodeD1._id,
            connectionType: "directional",
            connectionName: "Directional Link from 3 to 1",
            searchConnectionName: "directional link from 3 to 1",
            boardId: board._id,
            userId: user._id
        });
        console.log("Created 3 directional connections.");

        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
};

seedDatabase();
