const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, NotificationController.getNotifications);
router.get('/unread-count', authMiddleware, NotificationController.getUnreadCount);
router.put('/:id/read', authMiddleware, NotificationController.markAsRead);
router.put('/mark-all-read', authMiddleware, NotificationController.markAllAsRead);

module.exports = router;
