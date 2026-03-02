import { validatePayload } from "../../utils/validatePayload.until.js";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/token.until.js";
import { createAccessTokenModel, findRefreshTokenHashModel, revokeSessionByRefreshTokenHashModel, updateRefreshTokenModel } from "./auth.model.js";
import { signInService, signUpService } from "./auth.service.js";
import { signInValid, signUpValid } from "./auth.validation.js"
import { successResponse, validationErrorResponse, errorResponse } from "../../utils/response.util.js";
import dotenv from "dotenv"
dotenv.config()
const REFRESH_DAYS = 7
const addDays = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);
export const signIn = async (req, res, next) => {
    try {
        const { body, ip } = req
        const userAgent = req.get("user-agent");
        const { errors } = validatePayload(signInValid, body)
        if (errors) {
            return validationErrorResponse(res, errors, 400)
        }
        const user = await signInService(body)
        delete user.passwordHash
        const { id } = user
        const accessToken = signAccessToken({ id: user.id, username: user.username, role: user.role })
        const refreshToken = signRefreshToken({ id: user.id })
        const refreshToKenHash = hashToken(refreshToken)
        const expiresAt = addDays(REFRESH_DAYS);
        await createAccessTokenModel({ userId: id, refreshToKenHash: refreshToKenHash, expiresAt: expiresAt, ip, userAgent })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            path: "/api/auth/refresh-token",
            maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
        });
        return successResponse(res, "Đăng nhập thành công", { user, accessToken }, 200)
    } catch (error) {
        next(error)
    }
}
export const signUp = async (req, res, next) => {
    try {
        const payload = req.body;
        const { errors } = validatePayload(signUpValid, payload)
        if (errors) {
            return validationErrorResponse(res, errors, 400)
        }
        const user = await signUpService(payload);

        return successResponse(res, "Đăng ký tài khoản thành công", user, 200)
    } catch (error) {
        console.log(error)
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

        const newAccessToken = signAccessToken({ id: session.userId })
        const newRefreshToken = signRefreshToken({ id: session.userId })
        const newHash = hashToken(newRefreshToken);

        const result = await updateRefreshTokenModel({ id: session.id, refreshToKenHash: newHash, expiresAt: newExpiresAt })
        if (result.affectedRows !== 1) {
            const error = new Error("Session đã thay đổi, thử lại.")
            error.name = "SESSION_ERROR"
            error.status = 400
            throw error
        }
        return successResponse(res, "Làm mới token thành công", { accessToken: newAccessToken, refreshToken: newRefreshToken }, 200);
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
        return successResponse(res, "Đã đăng xuất", null, 200);
    } catch (error) {
        next(error)
    }
}