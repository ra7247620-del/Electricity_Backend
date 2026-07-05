const OutageReport = 
require('../models/OutageReport');
const Notification = 
require('../models/Notification');
class ReportService {
    static async createReport(reportData) {
        const reportId = await 
OutageReport.create(reportData);
        return await 
OutageReport.findById(reportId);
    }
    static async getMyReports(userId) {
        return await 
OutageReport.findByUserId(userId);
    }
    static async getAllReports() {
        return await 
OutageReport.findAll();
    }
    static async getReportById(id) {
        return await 
OutageReport.findById(id);
    }
    static async updateReportStatus(id, 
status) {
        const report = await 
OutageReport.findById(id);
        if (!report) {
            throw new Error('Report not 
found');
        }
        await OutageReport.updateStatus(id, 
status);
        // Create notification for the user
        const message = `Your outage report 
#${id} status has been updated to: 
${status}`;
        await 
Notification.create(report.user_id, id, 
message);
        return await 
OutageReport.findById(id);
    }
{
    static async getDashboardStats(userId) 
        // resolved_reports, my_reports, 
status_counts
        const stats = await 
OutageReport.getStats();
        const myReportsCount = await 
OutageReport.countByUser(userId);
        const total = Number(stats.total) 
|| 0;
        const pending = 
Number(stats.pending) || 0;
        const inProgress = 
Number(stats.in_progress) || 0;
        const resolved = 
Number(stats.resolved) || 0;
        return {
            total_reports: total,
            pending_reports: pending,
            in_progress_reports: 
inProgress,
            resolved_reports: resolved,
            my_reports: myReportsCount,
            status_counts: [
                { status: 'pending', count: 
pending },
                { status: 'in_progress', 
count: inProgress },
                { status: 'resolved', 
count: resolved }
            ]
        };
    }
}
module.exports = ReportService;
