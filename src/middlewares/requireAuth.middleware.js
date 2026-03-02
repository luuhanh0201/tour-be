import { verifyAccessToken } from "../utils/token.until.js"

export const requiredAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || ""
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
        if (!token) {
            const error = new Error("Thiếu access token")
            error.status = 401
            error.name = "UNAUTHORIZED"
            throw error
        }
        const decoded = verifyAccessToken(token)
        req.user = decoded
        next()
    } catch (error) {
        next(error)
    }
}
export const requireAdmin = async (req, res, next) => {
    try {
        const { role } = req.user
        if (role !== "admin") {
            const error = new Error("Bạn không có quyền thực hiện hành động này.")
            error.name = "ROLE_ERROR"
            error.status = 403
            throw error
        }
        next()
    } catch (error) {
        next(error)
    }
}
export const requireGuider = async (req, res, next) => {
    try {
        const { role } = req.user
        if (role !== "guider") {
            const error = new Error("Bạn không có quyền.")
            error.name = "ROLE_ERROR"
            error.status = 400
            throw error
        }
        next()
    } catch (error) {
        next(error)
    }
}