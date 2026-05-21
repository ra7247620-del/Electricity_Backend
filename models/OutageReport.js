const pool = require('../config/database');

class OutageReport {
    static async create(reportData) {
        const { user_id, location, severity, outage_type, description } = reportData;
        
        const [result] = await pool.execute(
            'INSERT INTO outage_reports (user_id, location, severity, outage_type, description) VALUES (?, ?, ?, ?, ?)',
            [user_id, location, severity, outage_type, description]
        );
        
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username 
             FROM outage_reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.id = ?`,
            [id]
        );
        return rows[0];
    }

    static async findByUserId(userId) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username 
             FROM outage_reports r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.user_id = ? 
             ORDER BY r.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async findAll() {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username 
             FROM outage_reports r 
             JOIN users u ON r.user_id = u.id 
             ORDER BY r.created_at DESC`
        );
        return rows;
    }

    static async updateStatus(id, status) {
        await pool.execute(
            'UPDATE outage_reports SET status = ? WHERE id = ?',
            [status, id]
        );
    }

    static async getStats() {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
            FROM outage_reports
        `);
        return rows[0];
    }

    static async getRecentReports(limit = 10) {
        const [rows] = await pool.execute(
            `SELECT r.*, u.username 
             FROM outage_reports r 
             JOIN users u ON r.user_id = u.id 
             ORDER BY r.created_at DESC 
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}

module.exports = OutageReport;
