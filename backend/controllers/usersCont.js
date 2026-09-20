import { User } from "../models/usersModel.js";
import { StatusCodes } from 'http-status-codes';

export const getUsers = async (req, res) => {
    const users = await User.find({}).select("-password")
    res.status(StatusCodes.OK).json({ users })
}


export const showCurrentUser = async (req, res) => {
    const user = req.user
    res.status(StatusCodes.OK).json(user)
}

export const updateUser = async (req, res) => {
    res.send("update user")
}

export const deleteUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findByIdAndDelete({ _id: id })

    res.status(StatusCodes.OK).json({ msg: "User deleted" })
}
