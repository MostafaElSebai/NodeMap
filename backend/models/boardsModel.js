import mongoose from "mongoose";


const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Board Name is required"],
        maxLength: [100, "Board Name cannot exceed 100 characters"]
    },
    searchName: {
        type: String,
        trim: true,
        required: [true, "Board search Name is required"],
        maxLength: [100, "Board search Name cannot exceed 100 characters"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    }
}, { timestamps: true });

boardSchema.post("findOneAndDelete", async function (deletedBoard) {
    const node = mongoose.model("Node")
    const connection = mongoose.model("Connection")
    const nodeType = mongoose.model("NodeType")

    await node.deleteMany({ boardId: deletedBoard._id })
    await connection.deleteMany({ boardId: deletedBoard._id })
    await nodeType.deleteMany({ boardId: deletedBoard._id })
})

boardSchema.methods.graphLookUp = async function (boardId, startNode) {

    const node = mongoose.model("Node")
    const boardObjectId = new mongoose.Types.ObjectId(boardId);
    const startNodeObjectId = new mongoose.Types.ObjectId(startNode);


    const pipeline = [{
        $match: { boardId: boardObjectId, _id: startNodeObjectId }
    },
    {
        $graphLookup: {
            from: "connections",
            startWith: startNodeObjectId,
            connectToField: "source",
            connectFromField: "target",
            as: "data",
            depthField: "step"
        }
    }]


    const result = await node.aggregate(pipeline)

    return result


}
export const Board = mongoose.model("Board", boardSchema)