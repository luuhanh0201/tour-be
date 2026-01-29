import { poolConnection, query } from "../../config/database.js";

export const findUsernameModel = async ({ username = "", email = "" } = {}) => {
    username = username.trim().toLocaleLowerCase()
    email = email.trim().toLocaleLowerCase()
    const sql = "SELECT * FROM users WHERE (username = ? OR email = ?) LIMIT 1";
    const [rows] = await query(sql, [username, email])
    const user = rows[0] || null
    return {
        user, exists: !!user
    }
}
export const findUserByIdModel = async (id) => {
    const sql = "SELECT * FROM users WHERE id = ? LIMIT 1";
    const [rows] = await query(sql, [id])
    const user = rows[0] || null
    if (!user) {
        return { user: null, exist: false }
    }
    const { password_hash, ...safeUser } = user
    return {
        user: safeUser, exist: !!user
    }
}
export const createUserModel = async ({ username, fullName, email, password }) => {
    const sql = "INSERT INTO users(username,full_name,email,password_hash) VALUES (?,?,?,?)"
    const [row] = await query(sql, [username, fullName, email, password])
    return row || null
}
export const createAccessTokenModel = async ({ userId, refreshToKenHash, expiresAt, ip, userAgent }) => {
    const sql = "INSERT INTO user_sessions (user_id, refresh_token_hash, expires_at, ip, user_agent) VALUES (?, ?, ?, ?, ?)";
    const [row] = await query(sql, [userId, refreshToKenHash, expiresAt, ip, userAgent])
    return row || null
}
export const findRefreshTokenHashModel = async ({ refreshToKenHash }) => {
    const sql = "SELECT id, user_id FROM user_sessions WHERE refresh_token_hash = ? AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1"
    const [row] = await query(sql, [refreshToKenHash])
    return row[0] || null
}
export const updateRefreshTokenModel = async ({ id, refreshToKenHash, expiresAt }) => {
    const sql = "UPDATE user_sessions SET refresh_token_hash = ?, expires_at = ? WHERE id = ? AND revoked_at IS NULL"
    const [row] = await query(sql, [refreshToKenHash, expiresAt, id])
    return row || null
}
export const revokeSessionByRefreshTokenHashModel = async ({ refreshToKenHash }) => {
    const sql = "UPDATE user_sessions SET revoked_at = NOW() WHERE refresh_token_hash = ? AND revoked_at IS NULL"
    const [row] = await query(sql, [refreshToKenHash])
    return row || null
}