import mongoose from "mongoose";


const nodeTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Node Type name is required"]
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: [true, "Board ID is required"]
    }
}, { timestamps: true })

export const NodeType = mongoose.model("NodeType", nodeTypeSchema)