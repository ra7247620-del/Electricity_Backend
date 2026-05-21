const pool = require('../config/database');

class RefreshToken {
    static async create(userId, token, expiresAt) {
        const [result] = await pool.execute(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
        return result.insertId;
    }

    static async findByToken(token) {
        const [rows] = await pool.execute(
            'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
            [token]
        );
        return rows[0];
    }

    static async deleteByUserId(userId) {
        await pool.execute(
            'DELETE FROM refresh_tokens WHERE user_id = ?',
            [userId]
        );
    }

    static async deleteByToken(token) {
        await pool.execute(
            'DELETE FROM refresh_tokens WHERE token = ?',
            [token]
        );
    }
}

module.exports = RefreshToken;
