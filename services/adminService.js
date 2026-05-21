const User = require('../models/User');
const OutageReport = require('../models/OutageReport');

class AdminService {
    static async getAllUsers() {
        return await User.findAll();
    }

    static async updateUserRole(userId, role) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await User.updateRole(userId, role);
        return await User.findById(userId);
    }

    static async deleteUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        await User.delete(userId);
    }

    static async getAdminDashboard() {
        const users = await User.findAll();
        const reports = await OutageReport.findAll();
        const stats = await OutageReport.getStats();

        return {
            totalUsers: users.length,
            totalReports: reports.length,
            stats,
            recentReports: await OutageReport.getRecentReports(10)
        };
    }
}

module.exports = AdminService;
