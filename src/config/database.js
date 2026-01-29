import dotenv from "dotenv";
import mysql from "mysql2/promise";
import { toCamel, toSnake } from "../utils/case.util.js";
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "+07:00"
})

// Wrapper query that converts params (camelCase -> snake_case) and
// maps result rows (snake_case -> camelCase)
export async function query(sql, params = []) {
    // convert params objects if any
    const mappedParams = params.map(p => (p && typeof p === 'object' && !Array.isArray(p)) ? toSnake(p) : p);
    const [rows] = await pool.query(sql, mappedParams);
    // map rows to camelCase
    if (Array.isArray(rows)) {
        return [toCamel(rows), rows];
    }
    return [toCamel(rows), rows];
}

// expose raw pool for advanced usage
export const poolConnection = pool;

export default pool;

