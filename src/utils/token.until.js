import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import crypto from "crypto";
dotenv.config()

export const signAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "6d" })
}

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}

export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}
export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}