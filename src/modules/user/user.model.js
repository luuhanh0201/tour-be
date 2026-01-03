import { poolConnection } from "../../config/database.js";
import { isBlockOrNull, setRoleOrNull, trimOrNull } from "../../utils/formatterValue.until.js";

export const findAllUserModel = async ({ page = 1, limit = 10, q = "" } = {}) => {
    try {
        q = String(q ?? "").trim()
        page = Math.max(1, parseInt(page || 1, 10))
        limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)));
        const offset = (page - 1) * limit
        const keyword = `%${q}%`
        const where = q ? "WHERE (username LIKE ? OR email LIKE ? OR full_name LIKE ?)" : ""
        const sqlData = `SELECT * FROM users ${where} ORDER BY id desc  LIMIT ? OFFSET ?`
        const paramsData = q ? [keyword, keyword, keyword, limit, offset] : [limit, offset]
        const [rows] = await poolConnection.query(sqlData, paramsData)
        const sqlCount = `SELECT COUNT(*)  AS total FROM users ${where}`
        const paramsCount = q ? [keyword, keyword, keyword] : []
        const [[countRow]] = await poolConnection.query(sqlCount, paramsCount);
        return {
            data: rows,
            pagination: {
                q,
                page,
                limit,
                total: countRow.total,
                totalPages: Math.ceil(countRow.total / limit),
            },
        };
    } catch (error) {
        throw error
    }
}

export const adminUpdateUserModel = async (payload = {}) => {
    const conn = await poolConnection.getConnection();
    try {
        const { userId, username, fullName, email, role, isBlock, phone, dateOfBirth, avatar, languages, certificates, experienceYears, bio, employmentStatus, workingStatus } = payload
        await conn.beginTransaction()

        const sqlUser = "UPDATE users SET  username  = COALESCE(?, username), full_name = COALESCE(?, full_name), email = COALESCE(?, email), role = COALESCE(?, role), is_block = COALESCE(?, is_block) WHERE id = ?"

        const paramsUser = [trimOrNull(username), trimOrNull(fullName), trimOrNull(email), setRoleOrNull(role), isBlockOrNull(isBlock), userId]
        const [userUpdated] = await poolConnection.query(sqlUser, paramsUser)

        const sqlProfile = `UPDATE guide_profiles SET
                                    phone = COALESCE(?,phone),
                                    date_of_birth = COALESCE(?,date_of_birth),
                                    avatar = COALESCE(?,avatar),
                                    languages = COALESCE(?,languages),
                                    certificates = COALESCE(?,certificates),
                                    experience_years = COALESCE(?,experience_years),
                                    bio = COALESCE(?,bio),
                                    employment_status = COALESCE(?,employment_status),
                                    working_status = COALESCE(?,working_status)
                            WHERE user_id = ?`
        const paramsProfile = [trimOrNull(phone), trimOrNull(dateOfBirth), trimOrNull(avatar), trimOrNull(JSON.stringify(languages)), trimOrNull(certificates), trimOrNull(experienceYears), trimOrNull(bio), trimOrNull(employmentStatus), trimOrNull(workingStatus), userId]
        const [profileUpdated] = await poolConnection.query(sqlProfile, paramsProfile)
        await conn.commit()
        return { userUpdated, profileUpdated };
    } catch (error) {
        await conn.rollback()
        throw error
    }
}
export const guideUpdateProfileModel = async (payload = {}) => {
    try {
        const { userId, phone, dateOfBirth, avatar, languages, certificates, experienceYears, bio } = payload
        const sqlProfile = `UPDATE guide_profiles SET
                                    phone = COALESCE(?,phone),
                                    date_of_birth = COALESCE(?,date_of_birth),
                                    avatar = COALESCE(?,avatar),
                                    languages = COALESCE(?,languages),
                                    certificates = COALESCE(?,certificates),
                                    experience_years = COALESCE(?,experience_years),
                                    bio = COALESCE(?,bio)
                        WHERE user_id = ?`

        const params = [trimOrNull(phone), trimOrNull(dateOfBirth), trimOrNull(avatar), trimOrNull(JSON.stringify(languages)), trimOrNull(certificates), trimOrNull(experienceYears), trimOrNull(bio), userId]
        const [result] = await poolConnection.query(sqlProfile, params)
        return result
    } catch (error) {
        throw error
    }
}
export const getUserWithProfileByIdModel = async (id) => {
    const sql = `SELECT
                        u.id as userId,
                        u.username as username,
                        u.full_name as fullName,
                        u.email as email,
                        u.role as role,
                        u.is_block as isBlock,

                        gp.phone             AS phone,
                        gp.date_of_birth     AS dateOfBirth,
                        gp.avatar            AS avatar,
                        gp.languages         AS languages,
                        gp.certificates      AS certificates,
                        gp.experience_years  AS experienceYears,
                        gp.bio               AS bio,
                        gp.employment_status AS employmentStatus,
                        gp.working_status    AS workingStatus
                FROM users u LEFT JOIN guide_profiles gp ON gp.user_id = u.id WHERE u.id = ?`

    const [rows] = await poolConnection.query(sql, [id])
    console.log(rows)
    const userProfile = rows[0]
    return { exist: !!userProfile, userProfile }
}