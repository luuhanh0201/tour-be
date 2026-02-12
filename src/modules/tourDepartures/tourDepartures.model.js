import { query } from "../../config/database.js";

export const createTourDepartureModel = async (payload) => {
    const { tourId, guideId, departureCode, departureDay, departureTime, returnDay, returnTime, meetingPoint, meetingTime, driverName, driverPhone, vehicleInfo, currentParticipants, maxParticipants, status, notes } = payload;
    const sql = `INSERT INTO tour_departures(tour_id,guide_id,departure_code,departure_day,departure_time,return_day,return_time,meeting_point,meeting_time,driver_name,driver_phone,vehicle_info,current_participants,max_participants,status,notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
    const params = [tourId, guideId, departureCode, departureDay, departureTime, returnDay, returnTime, meetingPoint, meetingTime, driverName, driverPhone, vehicleInfo, currentParticipants, maxParticipants, status, notes]
    const [row] = await query(sql, params)
    return row
}
export const findTourDepartureByIdModel = async (id) => {
    const sql = "SELECT * FROM tour_departures WHERE id = ? LIMIT 1";
    const [rows] = await query(sql, [id]);
    const departure = rows[0] || null
    return {
        exist: !!departure,
        departure
    }
}
export const findTourDepartureByCodeModel = async (departureCode) => {
    const sql = "SELECT * FROM tour_departures WHERE departure_code = ? LIMIT 1";
    const [rows] = await query(sql, [departureCode]);
    const departure = rows[0] || null
    return {
        exist: !!departure,
        departure
    }
}
export const getAllTourDepartureModel = async ({ q = "", limit = 10, page = 1 }) => {
    q = String(q ?? "").trim()
    page = Math.max(1, parseInt(page || 1, 10))
    limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)))

    const offset = (page - 1) * limit
    const keyword = `%${q}%`

    const where = q ? `WHERE t.name LIKE ? OR td.status LIKE ?` : ""

    const params = q ? [keyword, keyword, limit, offset] : [limit, offset]

    const sql = `
    SELECT td.*, t.name AS tourName
    FROM tour_departures td
    INNER JOIN tours t ON td.tour_id = t.id
    ${where}
    ORDER BY t.name
    LIMIT ? OFFSET ?
  `
    const [rows] = await query(sql, params)

    const sqlCount = `
    SELECT COUNT(DISTINCT t.name) AS total
    FROM tour_departures td
    INNER JOIN tours t ON td.tour_id = t.id
    ${where}
  `
    const paramsCount = q ? [keyword, keyword] : []
    const [[countRow]] = await query(sqlCount, paramsCount)

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total: Number(countRow.total) || 0,
            totalPages: Math.ceil((Number(countRow.total) || 0) / limit),
        },
    }
}
export const changeStatusTourDepartureModel = async (id, status) => {
    const validStatus = ['in_progress', 'scheduled', 'completed', 'cancelled']
    if (!validStatus.includes(status)) {
        status = null
    }
    const sql = "UPDATE tour_departures SET status = COALESCE(?,status) WHERE id = ?"
    const params = [status, id]
    const [result] = await query(sql, params)
    return result


}
