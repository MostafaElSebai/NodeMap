import { verifyJWT } from "../utils/jwt.js";
import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/customError.js";


export const checkUser = async (req, res, next) => {

    // console.log("middleware", req.query)

    const { token } = req.signedCookies

    if (!token) {
        throw new CustomAPIError("No token", StatusCodes.UNAUTHORIZED)
    }
    try {
        const decodedToken = verifyJWT({ token })
        req.user = decodedToken
        next()
    } catch (error) {
        throw new CustomAPIError("Invalid token", StatusCodes.UNAUTHORIZED)
    }
}
