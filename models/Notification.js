const pool = require('../config/database');

class Notification {
    static async create(userId, reportId, message) {
        const [result] = await pool.execute(
            'INSERT INTO notifications (user_id, report_id, message) VALUES (?, ?, ?)',
            [userId, reportId, message]
        );
        return result.insertId;
    }

    static async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    }

    static async markAsRead(id) {
        await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE id = ?',
            [id]
        );
    }

    static async markAllAsRead(userId) {
        await pool.execute(
            'UPDATE notifications SET is_read = TRUE WHERE user_id = ?',
            [userId]
        );
    }

    static async getUnreadCount(userId) {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );
        return rows[0].count;
    }
}

module.exports = Notification;
