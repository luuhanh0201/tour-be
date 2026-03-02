import { poolConnection, query } from "../../config/database.js";

export const findAllServiceModel = async ({ page = 1, limit = 10, q = "" } = {}) => {
    q = String(q ?? "").trim();
    page = Math.max(1, parseInt(page || 1, 10));
    limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)));
    const offset = (page - 1) * limit;
    console.log(123)
    const keyword = `%${q}%`;
    const where = q ? `WHERE service_name LIKE ? OR service_type LIKE ?` : "";

    const sqlData = `
        SELECT ts.*, t.name as tourName FROM tour_services ts INNER JOIN tours t ON ts.tour_id = t.id
        ${where}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `;

    const paramsData = q ? [keyword, keyword, limit, offset] : [limit, offset];
    const [rows] = await query(sqlData, paramsData);

    const sqlCount = `
        SELECT COUNT(*) AS total
        FROM tour_services
        ${where}
      `;
    const paramsCount = q ? [keyword, keyword] : [];
    const [[countRow]] = await query(sqlCount, paramsCount);

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total: countRow.total,
            totalPages: Math.ceil(countRow.total / limit),
        },
    };

}
export const findServiceByIdModel = async ({ id }) => {
    const sql = "SELECT * FROM tour_services WHERE id = ? LIMIT 1";
    const [rows] = await query(sql, [id])
    const service = rows[0] || null
    return {
        exists: !!service,
        service: service || null
    }
}
export const findServiceByNameModel = async ({ serviceName }) => {
    const sql = "SELECT * FROM tour_services WHERE service_name = ? LIMIT 1";
    const [rows] = await query(sql, [serviceName])
    const service = rows[0] || null
    return {
        exists: !!service,
        service: service || null
    }
}
export const createServiceModel = async ({ tourId, serviceType, serviceName, contactInfo, address, description }) => {
    const sql = "INSERT INTO tour_services (tour_id,service_type,service_name,contact_info,address,description) VALUES (?,?,?,?,?,?)"
    const [row] = await query(sql, [tourId, serviceType, serviceName, contactInfo, address, description])
    return row || null
}
export const updateServiceModel = async ({ serviceId, tourId, serviceType, serviceName, contactInfo, address, description }) => {
    const sql = "UPDATE tour_services SET tour_id = ?,service_type = ?,service_name = ?,contact_info = ?,address = ?,description = ? WHERE id = ?"
    const [result] = await query(sql, [tourId, serviceType, serviceName, contactInfo, address, description, serviceId])
    return result
}
export const deleteServiceModel = async (id) => {
    const sql = "DELETE FROM tour_services WHERE id = ?"
    const [result] = await query(sql, [id])
    return result?.affectedRows > 0
}