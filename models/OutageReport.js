const pool = require('../config/database');
class OutageReport {
    static async create(reportData) {
        const { user_id, location, 
severity, outage_type, description, 
latitude, longitude, address } = 
reportData;
        const [result] = await 
pool.execute(
            'INSERT INTO outage_reports 
(user_id, location, severity, outage_type, 
description, latitude, longitude, address) 
    }
VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, location, severity, 
outage_type, description, latitude || null, 
longitude || null, address || null]
        );
        return result.insertId;
    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username AS 
user_name
             FROM outage_reports r 
             JOIN users u ON r.user_id = 
u.id 
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }
    static async findByUserId(userId) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username AS 
user_name
             FROM outage_reports r 
             JOIN users u ON r.user_id = 
u.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    }
    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username AS 
user_name
             FROM outage_reports r 
             JOIN users u ON r.user_id = 
u.id 
             ORDER BY r.created_at DESC`
        );
        return rows;
    }
    static async updateStatus(id, status) {
        await pool.execute(
            'UPDATE outage_reports SET 
status = ? WHERE id = ?',
            [status, id]
        );
    }
    static async getStats() {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total,
                COALESCE(SUM(CASE WHEN 
status = 'pending' THEN 1 ELSE 0 END), 0) 
as pending,
                COALESCE(SUM(CASE WHEN 
status = 'in_progress' THEN 1 ELSE 0 END), 
0) as in_progress,
                COALESCE(SUM(CASE WHEN 
status = 'resolved' THEN 1 ELSE 0 END), 0) 
as resolved
            FROM outage_reports
        `);
        return rows[0];
    }
    static async countByUser(userId) {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM 
outage_reports WHERE user_id = ?',
            [userId]
        );
        return Number(rows[0].count) || 0;
    }
    static async getRecentReports(limit = 
10) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username AS 
user_name
             FROM outage_reports r 
             JOIN users u ON r.user_id = 
u.id 
             ORDER BY r.created_at DESC 
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}
module.exports = OutageReport;
