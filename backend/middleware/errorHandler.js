import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "../errors/customError.js";

export function errorHandler(err, req, res, next) {
    const customError = new CustomAPIError(
        err.message || "Something Went Wrong",
        err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    )
    console.log(customError);

    res.status(customError.statusCode).json({ msg: customError.message })
}