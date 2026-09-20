import mongoose from "mongoose";


const nodeSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NodeType",
        required: [true, "Node Type is required"]
    },
    // typeName: {
    //     type: String,
    //     trim: true,
    //     required: [true, "Type name is required"]
    // },
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
        maxLength: [100, "Title cannot exceed 100 characters"]
    },
    position: {
        type: Object,
        required: [true, "Position is required"],
        properties: {
            x: {
                type: Number,
                default: 0,
                required: [true, "X position is required"]
            },
            y: {
                type: Number,
                default: 0,
                required: [true, "Y position is required"]
            }
        }
    },
    searchTitle: {
        type: String,
        trim: true,
        required: [true, "Title is required"],
        maxLength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        maxLength: [500, "Description cannot exceed 500 characters"]

    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
        required: [true, "Board ID is required"]
    }
}, { timestamps: true });

nodeSchema.post("findOneAndDelete", async function (deletedNode) {
    const connection = mongoose.model("Connection")

    await connection.deleteMany({ $or: [{ parentNode: deletedNode._id }, { childNode: deletedNode._id }] })


})

nodeSchema.index({ searchTitle: 1, boardId: 1 }, { unique: true })

export const Node = mongoose.model("Node", nodeSchema)