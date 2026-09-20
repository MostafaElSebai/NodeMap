import { User } from "../models/usersModel.js";
import { StatusCodes } from 'http-status-codes';
import { attachCookieToResponse } from "../utils/attachCookieToResponse.js";
import { CustomAPIError } from "../errors/customError.js";


export const registerUser = async (req, res) => {
    let { name, email, role, password } = req.body

    if (role === "guest") {
        const userGuestId = crypto.randomUUID()
        const user = await User.create({
            userGuestId,
            role
        })
        if (!user) {
            throw new Error("Failed to create user")
        }


        const tokenUser = {
            userGuestId,
            userId: user._id,
            role
        }

        attachCookieToResponse({ res, user: tokenUser })

        return res.status(StatusCodes.CREATED).json(tokenUser)
    } else {

        if (!name || !email || !password) {
            throw new CustomAPIError("Please provide the required data", StatusCodes.BAD_REQUEST)
        }

        role = "user"

        const user = await User.create({
            name,
            email,
            role,
            password
        })

        if (!user) {
            throw new Error("Failed to create user")
        }

        const tokenUser = {
            name,
            userId: user._id,
            role
        }

        attachCookieToResponse({ res, user: tokenUser })



        return res.status(StatusCodes.CREATED).json(tokenUser)
    }
}

export const registerGuest = async (req, res) => {
    const { userGuestId, userId } = req.user
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        throw new CustomAPIError("Please provide the required data", StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw new CustomAPIError("No Guest exists, please register a new user", StatusCodes.NOT_FOUND)
    }

    if (user.email === email) {
        throw new CustomAPIError("User already exists", StatusCodes.BAD_REQUEST)
    }

    const role = "user"
    user.name = name;
    user.userGuestId = undefined
    user.email = email;
    user.password = password;
    user.role = role
    await user.save()

    const tokenUser = {
        name,
        userId: user._id,
        role
    }

    attachCookieToResponse({ res, user: tokenUser })

    res.status(StatusCodes.OK).json(tokenUser)

}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new CustomAPIError("Please provide email and password", StatusCodes.BAD_REQUEST)
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new CustomAPIError("User not found", StatusCodes.NOT_FOUND)
    }

    const isPasswordCorrect = await user.matchPassword(password)

    if (!isPasswordCorrect) {
        throw new CustomAPIError("Invalid password", StatusCodes.UNAUTHORIZED)
    }

    const tokenUser = {
        name: user.name,
        userId: user._id
    }

    attachCookieToResponse({ res, user: tokenUser })

    res.status(StatusCodes.OK).json(tokenUser)
}

export const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now()),
        signed: true
    })

    res.status(StatusCodes.OK).json({ msg: 'User logged out' })
}
