import { poolConnection, query } from "../../config/database.js"

export const getAllCategoryModel = async ({ page = 1, limit = 10, q = "" } = {}) => {

  page = Math.max(1, parseInt(page || 1, 10));
  limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)));
  const offset = (page - 1) * limit;

  const keyword = `%${q}%`;
  const where = q ? `WHERE name LIKE ? OR description LIKE ?` : "";

  const sqlData = `
    SELECT * FROM categories
    ${where}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  const paramsData = q ? [keyword, keyword, limit, offset] : [limit, offset];
  const [rows] = await query(sqlData, paramsData);

  const sqlCount = `
    SELECT COUNT(*) AS total
    FROM categories
    ${where}
  `;
  const paramsCount = q ? [keyword, keyword] : [];
  const [[countRow]] = await query(sqlCount, paramsCount);

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
};

export const findCategoryByNameModel = async ({ name }) => {
  const sql = "SELECT * FROM categories WHERE name = ? LIMIT 1";
  const [rows] = await query(sql, [name])
  const category = rows[0] || null
  return {
    category, exists: !!category
  }
}
export const findCategoryByIdModel = async ({ id }) => {
  const sql = "SELECT * FROM categories WHERE id = ? LIMIT 1";
  const [rows] = await query(sql, [id])
  const category = rows[0] || null
  return {
    category, exists: !!category
  }
}
export const createCategoryModel = async ({ name, description = "" } = {}) => {
  const sql = "INSERT INTO categories (name,description) VALUES(?,?)";
  const [row] = await query(sql, [name, description])
  return row || null
}
export const updateCategoryModel = async ({ name, description = "", id } = {}) => {
  const sql = "UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?"
  const [result] = await query(sql, [name, description, id])
  return result
}
export const deleteCategoryModel = async (id) => {
  const sql = "DELETE FROM categories WHERE id = ?"
  const [result] = await query(sql, [id])
  return result?.affectedRows > 0
}