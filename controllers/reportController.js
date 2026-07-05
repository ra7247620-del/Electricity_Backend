const ReportService = 
require('../services/reportService');
const ResponseHandler = 
require('../utils/response');
class ReportController {
    static async createReport(req, res) {
        try {
            const { latitude, longitude, 
description, address, location, severity, 
outage_type } = req.body;
            if (!description) {
                return 
ResponseHandler.error(res, 'Description is 
required', 400);
            }
            const reportData = {
                user_id: req.user.id,
                location: location || address || 'Unknown location',
                severity: severity || 'medium',
                outage_type: outage_type || 'power_outage',
                description: description,
                latitude: latitude,
                longitude: longitude,
                address: address,
            };
            const report = await ReportService.createReport(reportData);
            ResponseHandler.success(res, 'Report created successfully', report, 201);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }
    static async getMyReports(req, res) {
        try {
            const reports = await 
ReportService.getMyReports(req.user.id);
            ResponseHandler.success(res, 
'Reports retrieved successfully', reports);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
        }
    }
    static async getAllReports(req, res) {
        try {
            const reports = await 
ReportService.getAllReports();
            ResponseHandler.success(res, 
'All reports retrieved successfully', 
reports);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
        }
    }
    static async getReportById(req, res) {
        try {
            const { id } = req.params;
            const report = await 
ReportService.getReportById(id);
            if (!report) {
                return 
ResponseHandler.error(res, 'Report not 
found', 404);
            }
            ResponseHandler.success(res, 
'Report retrieved successfully', report);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
        }
    }
    static async updateReportStatus(req, 
res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status) {
                return 
ResponseHandler.error(res, 'Status is 
required', 400);
            }
            const validStatuses = 
['pending', 'in_progress', 'resolved', 
'rejected'];
            if 
(!validStatuses.includes(status)) {
                return 
ResponseHandler.error(res, 'Invalid 
status', 400);
            }
            const report = await 
ReportService.updateReportStatus(id, 
status);
            ResponseHandler.success(res, 
'Report status updated successfully', 
report);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
        }
    }
    static async getDashboardStats(req, 
res) {
        try {
            const data = await 
ReportService.getDashboardStats(req.user.id
);
            ResponseHandler.success(res, 
'Dashboard stats retrieved successfully', 
data);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
        }
    }
}
module.exports = ReportController;
