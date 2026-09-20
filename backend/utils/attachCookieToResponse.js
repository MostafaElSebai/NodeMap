import { createJWT } from "./jwt.js"

export const attachCookieToResponse = ({ res, user }) => {

    const token = createJWT({ payload: user })

    const thirtyDays = 1000 * 60 * 60 * 24 * 30

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: thirtyDays,
        signed: true
    })

}