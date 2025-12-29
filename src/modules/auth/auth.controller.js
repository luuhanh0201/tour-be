import { validatePayload } from "../../utils/validatePayload.until.js";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/token.until.js";
import { createAccessTokenModel, findRefreshTokenHashModel, revokeSessionByRefreshTokenHashModel, updateRefreshTokenModel } from "./auth.model.js";
import { signInService, signUpService } from "./auth.service.js";
import { signInValid, signUpValid } from "./auth.validation.js"
import dotenv from "dotenv"
dotenv.config()
const REFRESH_DAYS = 7
const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
export const signIn = async (req, res, next) => {
    try {
        const { body, ip } = req
        const userAgent = req.get("user-agent");
        const error = validatePayload(signInValid, body)
        if (error) {
            return res.status(400).json(error)
        }
        const user = await signInService(body)
        const { id } = user
        const accessToken = signAccessToken({ id: user.id, username: user.username, role: user.role })
        const refreshToken = signRefreshToken({ id: user.id })
        const refreshToKenHash = hashToken(refreshToken)
        const expiresAt = addDays(REFRESH_DAYS);
        await createAccessTokenModel({ userId: id, refreshToKenHash: refreshToKenHash, expiresAt: expiresAt, ip, userAgent })
        return res.status(200).json({
            message: "Đăng nhập thành công",
            data: user,
            accessToken,
            refreshToken,
        })
    } catch (error) {
        next(error)
    }
}
export const signUp = async (req, res, next) => {
    try {
        const payload = req.body;
        const error = validatePayload(signUpValid, payload)
        if (error) {
            return res.status(400).json(error)
        }
        const user = await signUpService(payload);

        return res.json({
            message: "Đăng ký tài khoản thành công.",
            data: user
        })
    } catch (error) {
        next(error)
    }
}
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error = new Error("Token không tồn tại.")
            error.name = "REFRESH_TOKEN_ERROR"
            error.status = 400
            throw error
        }
        const payload = verifyRefreshToken(refreshToken)
        const refreshTokenHash = hashToken(refreshToken)
        const session = await findRefreshTokenHashModel({ refreshToKenHash: refreshTokenHash })
        const newExpiresAt = addDays(REFRESH_DAYS || 7);
        if (!session) {
            const error = new Error("Token không tồn tại.")
            error.name = "REFRESH_TOKEN_ERROR"
            error.status = 400
            throw error
        }

        const newAccessToken = signAccessToken({ id: session.user_id })
        const newRefreshToken = signRefreshToken({ id: session.user_id })
        const newHash = hashToken(newRefreshToken);

        const result = await updateRefreshTokenModel({ id: session.id, refreshToKenHash: newHash, expiresAt: newExpiresAt })
        if (result.affectedRows !== 1) {
            const error = new Error("Session đã thay đổi, thử lại.")
            error.name = "SESSION_ERROR"
            error.status = 400
            throw error
        }
        return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        next(error)
    }
}
export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const refreshHash = hashToken(refreshToken)
        if (!refreshHash) {
            const error = new Error("Token không tồn tại.")
            error.name = "REFRESH_TOKEN_ERROR"
            error.status = 400
            throw error
        }
        const result = await revokeSessionByRefreshTokenHashModel({ refreshToKenHash: refreshHash })
        if (result.affectedRows !== 1) {
            const error = new Error("Session đã thay đổi, thử lại.")
            error.name = "SESSION_ERROR"
            error.status = 400
            throw error
        }
        return res.status(200).json({ message: "Đã đăng xuất" });
    } catch (error) {
        next(error)
    }
}