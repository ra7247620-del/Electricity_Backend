const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, ReportController.createReport);
router.get('/my-reports', authMiddleware, ReportController.getMyReports);
router.get('/dashboard-stats', authMiddleware, ReportController.getDashboardStats);
router.get('/all', authMiddleware, adminMiddleware, ReportController.getAllReports);
router.get('/:id', authMiddleware, ReportController.getReportById);
router.put('/:id/status', authMiddleware, adminMiddleware, ReportController.updateReportStatus);

module.exports = router;
