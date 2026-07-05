const ReportService = 
require('../services/reportService');
const ResponseHandler = 
require('../utils/response');
class ReportController {
    static async createReport(req, res) {
        try {
            // 
✅ اﻟﻔﻼﺗﺮ ﺑﻴﺒﻌﺖ

latitude/longitude/description/address وﻻ lat/lng ﻣﺶ( //           
 
location/severity/outage_type) ﻓﺒﻨﻘﺮاﻫﻢ
            // ﻗﻴﻢ اﻓﺘﺮاﺿﻴ
ﺔ.ﻣﺶ ﻣﺘﺒﻌﺘﺔ

            //  ﺑﻨﻔﺲ اﻷﺳﻤﺎء اﻟﻠﻲ ﺑﻴﺒﻌﺘﻬﺎ اﻟﺘﻄﺒﻴﻖ، وﺑﻨﺤ
ﻂ ﻟﻠﺤﻘﻮل اﻟﻤﻄﻠﻮﺑﺔ ﻓﻲ ﻗﺎﻋﺪة اﻟﺒﻴﺎﻧﺎت ﻟ
ﻮ
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
                location: location || 
address || 'ﻏﻴﺮ ﻣﺤﺪد',
                severity: severity || 
'medium',
'power_outage',
            };
                outage_type: outage_type || 
                description,
                latitude,
                longitude,
                address
            const report = await 
ReportService.createReport(reportData);
            ResponseHandler.success(res, 
'Report created successfully', report, 
201);
        } catch (error) {
            ResponseHandler.error(res, 
error.message, 500);
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
