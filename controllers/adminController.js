const AdminService = require('../services/adminService');
const ResponseHandler = require('../utils/response');

class AdminController {
    static async getAllUsers(req, res) {
        try {
            const users = await AdminService.getAllUsers();
            ResponseHandler.success(res, 'Users retrieved successfully', users);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            if (!role) {
                return ResponseHandler.error(res, 'Role is required', 400);
            }

            const validRoles = ['user', 'admin'];
            if (!validRoles.includes(role)) {
                return ResponseHandler.error(res, 'Invalid role', 400);
            }

            const user = await AdminService.updateUserRole(id, role);
            ResponseHandler.success(res, 'User role updated successfully', user);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await AdminService.deleteUser(id);
            ResponseHandler.success(res, 'User deleted successfully');
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async getDashboard(req, res) {
        try {
            const data = await AdminService.getAdminDashboard();
            ResponseHandler.success(res, 'Admin dashboard data retrieved successfully', data);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }
}

module.exports = AdminController;
