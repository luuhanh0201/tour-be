import { query } from "../../config/database.js";

export const findAllCustomerModel = async ({ q = "", limit = 10, page = 1 } = {}) => {
  q = String(q ?? "").trim();
  page = Math.max(1, parseInt(page || 1, 10));
  limit = Math.min(100, Math.max(1, parseInt(limit || 10, 10)));
  const offset = (page - 1) * limit;

  const keyword = `%${q}%`;
  const where = q ? `WHERE full_name LIKE ? OR phone LIKE ? OR email LIKE ?` : "";

  const sqlData = `SELECT * FROM customers ${where} ORDER BY id DESC LIMIT ? OFFSET ?`;
  const params = q ? [keyword, keyword, keyword, limit, offset] : [limit, offset];
  const [rows] = await query(sqlData, params);

  const sqlCount = `SELECT COUNT(*) AS total FROM customers ${where}`;
  const paramsCount = q ? [keyword, keyword, keyword] : [];
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
};

export const findCustomerByIdModel = async ({ id }) => {
  const sql = "SELECT * FROM customers WHERE id = ? LIMIT 1";
  const [rows] = await query(sql, [id]);
  const customer = rows[0] || null;
  return { exists: !!customer, customer };
};

export const findCustomerByPhoneOrEmailModel = async ({ phone = "", email = "" } = {}) => {
  const sql = "SELECT * FROM customers WHERE phone = ? OR email = ? LIMIT 1";
  const [rows] = await query(sql, [phone, email]);
  const customer = rows[0] || null;
  return { exists: !!customer, customer };
};

export const createCustomerModel = async ({ fullName, phone = null, email = null, address = null, type = 'adult', notes = null } = {}) => {
  const sql = "INSERT INTO customers (full_name, phone, email, address, type, notes) VALUES (?,?,?,?,?,?)";
  const [row] = await query(sql, [fullName, phone, email, address, type, notes]);
  return row || null;
};

export const updateCustomerModel = async ({ id, fullName, phone, email, address, type, notes } = {}) => {
  const sql = `
    UPDATE customers SET
      full_name = COALESCE(?, full_name),
      phone = COALESCE(?, phone),
      email = COALESCE(?, email),
      address = COALESCE(?, address),
      type = COALESCE(?, type),
      notes = COALESCE(?, notes)
    WHERE id = ?`;
  const params = [fullName, phone, email, address, type, notes, id];
  const [result] = await query(sql, params);
  return result || null;
};

export const deleteCustomerModel = async (id) => {
  const sql = "DELETE FROM customers WHERE id = ?";
  const [result] = await query(sql, [id]);
  return result?.affectedRows > 0;
};

