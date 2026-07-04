const AuthService = require('../services/authService');
const ResponseHandler = require('../utils/response');

class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return ResponseHandler.error(res, 'Name, email, and password are required', 400);
            }

            const user = await AuthService.register({ name, email, password });
            ResponseHandler.success(res, 'User registered successfully', {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }, 201);
        } catch (error) {
            ResponseHandler.error(res, error.message, 400);
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return ResponseHandler.error(res, 'Email and password are required', 400);
            }

            const result = await AuthService.login(email, password);
            ResponseHandler.success(res, 'Login successful', result);
        } catch (error) {
            ResponseHandler.error(res, error.message, 401);
        }
    }

    static async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return ResponseHandler.error(res, 'Refresh token is required', 400);
            }

            const tokens = await AuthService.refreshToken(refreshToken);
            ResponseHandler.success(res, 'Token refreshed successfully', tokens);
        } catch (error) {
            ResponseHandler.error(res, error.message, 401);
        }
    }

    static async logout(req, res) {
        try {
            await AuthService.logout(req.user.id);
            ResponseHandler.success(res, 'Logout successful');
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }

    static async getProfile(req, res) {
        try {
            const user = await AuthService.getProfile(req.user.id);
            ResponseHandler.success(res, 'Profile retrieved successfully', user);
        } catch (error) {
            ResponseHandler.error(res, error.message, 500);
        }
    }
}

module.exports = AuthController;
