const OutageReport = require('../models/OutageReport');
const Notification = require('../models/Notification');

class ReportService {
    static async createReport(reportData) {
        const reportId = await OutageReport.create(reportData);
        return await OutageReport.findById(reportId);
    }

    static async getMyReports(userId) {
        return await OutageReport.findByUserId(userId);
    }

    static async getAllReports() {
        return await OutageReport.findAll();
    }

    static async getReportById(id) {
        return await OutageReport.findById(id);
    }

    static async updateReportStatus(id, status) {
        const report = await OutageReport.findById(id);
        if (!report) {
            throw new Error('Report not found');
        }

        await OutageReport.updateStatus(id, status);

        // Create notification for the user
        const message = `Your outage report #${id} status has been updated to: ${status}`;
        await Notification.create(report.user_id, id, message);

        return await OutageReport.findById(id);
    }

    static async getDashboardStats() {
        const stats = await OutageReport.getStats();
        const recentReports = await OutageReport.getRecentReports(10);
        
        return {
            stats,
            recentReports
        };
    }
}

module.exports = ReportService;
