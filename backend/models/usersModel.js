import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxLength: [100, "Name cannot exceed 100 characters"],
        required: function () {
            return this.role !== "guest"
        }
    },
    userGuestId: String,
    email: {
        type: String,
        unique: true,
        sparse: true,
        required: function () {
            return this.role !== "guest"
        },
        validate: function () {
            if (this.role !== "guest") {
                return [validator.isEmail(this.email, "Please provide a valid email")]
            }
        }
    },
    password: {
        type: String,
        required: function () {
            return this.role !== "guest"
        }
    },
    role: {
        type: String,
        enum: ["admin", "user", "guest"],
        default: "user"
    }
}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.post("findOneAndDelete", async function (deletedUser) {
    const board = mongoose.model("Board")
    const node = mongoose.model("Node")
    const connection = mongoose.model("Connection")
    const nodeType = mongoose.model("NodeType")

    // 1. Find all boards that belong to this user
    const userBoards = await board.find({ userId: deletedUser._id }).select("_id")
    const boardIds = userBoards.map(b => b._id)

    // 2. Delete all nodes, connections, and types that belong to those boards
    if (boardIds.length > 0) {
        await Promise.all(boardIds.map(async (bId) => {
            await node.deleteMany({ boardId: bId })
            await connection.deleteMany({ boardId: bId })
            await nodeType.deleteMany({ boardId: bId })
        }))
    }

    // 3. Finally, delete the boards themselves
    await board.deleteMany({ userId: deletedUser._id })
})

export const User = mongoose.model("User", userSchema)
