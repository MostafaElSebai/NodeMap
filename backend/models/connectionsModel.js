import mongoose from "mongoose";


const connectionSchema = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node",
        required: [true, "Source Node is required"]
    },
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Node",
        required: [true, "Target Node is required"]
    },
    groupId: {
        type: String,
    },
    connectionType: {
        type: String,
        enum: ["directional", "non-directional"],
        default: "non-directional",
    },
    connectionName: {
        type: String,
        trim: true,
        maxLength: [100, "Connection Name cannot exceed 100 characters"],
        required: [true, "Connection Name is required"]
    },
    searchConnectionName: {
        type: String,
        trim: true,
        maxLength: [100, "Connection Name cannot exceed 100 characters"],
        required: [true, "Connection Name is required"]
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

connectionSchema.index({ source: 1, target: 1 }, { unique: true });


export const Connection = mongoose.model("Connection", connectionSchema)
