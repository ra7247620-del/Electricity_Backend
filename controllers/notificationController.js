const NotificationService = require('../services/notificationService');
const ResponseHandler = require('../utils/response');

class NotificationController {
    static async getNotifications(req, res) {
        try {
            const notifications = await NotificationService.getUserNotifications(req.user.id);
            ResponseHandler.success(res, 'Notifications retrieved successfully', notifications);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            await NotificationService.markAsRead(id);
            ResponseHandler.success(res, 'Notification marked as read');
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async markAllAsRead(req, res) {
        try {
            await NotificationService.markAllAsRead(req.user.id);
            ResponseHandler.success(res, 'All notifications marked as read');
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async getUnreadCount(req, res) {
        try {
            const count = await NotificationService.getUnreadCount(req.user.id);
            ResponseHandler.success(res, 'Unread count retrieved successfully', { count });
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }
}

module.exports = NotificationController;
