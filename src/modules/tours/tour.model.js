import { poolConnection, query } from "../../config/database.js";

export const findAllTourModel = async ({ q = "", limit = 10, page = 1 } = {}) => {
    q = String(q ?? "").trim();
    page = Math.max(1, parseInt(page || 1, 10))
    limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)));
    const offset = (page - 1) * limit

    const keyword = `%${q}%`;

    const where = q ? `WHERE code LIKE ?  OR name LIKE ?` : ""

    const sqlData = `SELECT * FROM tours ${where} ORDER BY id DESC LIMIT ? OFFSET ?`
    const params = q ? [keyword, keyword, limit, offset] : [limit, offset]

    const [rows] = await query(sqlData, params)
    const sqlCount = `SELECT COUNT(*) as total FROM tours ${where}`
    const paramsCount = q ? [keyword, keyword] : []
    const [[countRow]] = await query(sqlCount, paramsCount)

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total: countRow.total,
            totalPages: Math.ceil(countRow.total / limit),
        },
    }


}
export const findTourByNameModel = async ({ tourName }) => {
    const sql = "SELECT * FROM tours WHERE name = ? LIMIT 1";
    const [rows] = await query(sql, [tourName]);
    const tour = rows[0] || null;
    return {
        exists: !!tour,
        tour
    }
}
export const findTourByCodeModel = async ({ code }) => {
    const sql = "SELECT * FROM tours WHERE code=? LIMIT 1";
    const [rows] = await query(sql, [code]);
    const tour = rows[0] || null;
    return {
        exist: !!tour,
        tour: tour
    }
}
export const findTourByIdModel = async ({ tourId }) => {
    // const sql = "SELECT * FROM tours WHERE id = ? LIMIT 1";
    const sql = "SELECT tour.*, category.name AS category_name FROM tours AS tour INNER JOIN categories AS category ON tour.category_id = category.id WHERE tour.id = ? LIMIT 1";
    const [rows] = await query(sql, [tourId]);
    const tour = rows[0] || null;
    return {
        exist: !!tour,
        tour: tour
    }
}
export const addNewTourModel = async (payload = {}) => {
    const { code, name, categoryId, durationDays, durationNights, description, highlights, basePrice, status } = payload
    const sql = "INSERT INTO tours (code,name,category_id, duration_days,duration_nights,description,highlights,base_price,status) VALUES (?,?,?,?,?,?,?,?,?)"
    const [row] = await query(sql, [code, name, categoryId, durationDays, durationNights, description, highlights, basePrice, status])
    return row || null
}
export const updateTourModel = async (payload = {}) => {
    const { id, name, categoryId, durationDays, durationNights, description, highlights, basePrice, status } = payload;
    const sql = `
                UPDATE tours SET
                    name = COALESCE(?, name),
                    category_id = COALESCE(?, category_id),
                    duration_days = COALESCE(?, duration_days),
                    duration_nights = COALESCE(?, duration_nights),
                    description = COALESCE(?, description),
                    highlights = COALESCE(?, highlights),
                    base_price = COALESCE(?, base_price),
                    status = COALESCE(?, status)
                WHERE id = ?`;
    const params = [name, categoryId, durationDays, durationNights, description, highlights, basePrice, status, id];
    const [result] = await query(sql, params);
    return result || null;
}

export const deleteTourModel = async (id) => {
    const sql = "DELETE FROM tours WHERE id = ?";
    const [result] = await query(sql, [id]);
    return result?.affectedRows > 0;
}
