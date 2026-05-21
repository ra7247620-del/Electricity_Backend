const Notification = require('../models/Notification');

class NotificationService {
    static async getUserNotifications(userId) {
        return await Notification.findByUserId(userId);
    }

    static async markAsRead(notificationId) {
        await Notification.markAsRead(notificationId);
    }

    static async markAllAsRead(userId) {
        await Notification.markAllAsRead(userId);
    }

    static async getUnreadCount(userId) {
        return await Notification.getUnreadCount(userId);
    }
}

module.exports = NotificationService;
