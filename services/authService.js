const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const JWTHandler = require('../utils/jwt');

class AuthService {
    static async register(userData) {
        const existingUser = await User.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const userId = await User.create(userData);
        return await User.findById(userId);
    }

    static async login(email, password) {
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const accessToken = JWTHandler.generateAccessToken(payload);
        const refreshToken = JWTHandler.generateRefreshToken(payload);

        // Calculate refresh token expiry
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

        // Store refresh token in database
        await RefreshToken.create(user.id, refreshToken, refreshTokenExpiry);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    static async refreshToken(refreshToken) {
        const tokenRecord = await RefreshToken.findByToken(refreshToken);
        if (!tokenRecord) {
            throw new Error('Invalid refresh token');
        }

        const decoded = JWTHandler.verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        const newAccessToken = JWTHandler.generateAccessToken(payload);
        const newRefreshToken = JWTHandler.generateRefreshToken(payload);

        // Delete old refresh token
        await RefreshToken.deleteByToken(refreshToken);

        // Store new refresh token
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);
        await RefreshToken.create(user.id, newRefreshToken, refreshTokenExpiry);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    static async logout(userId) {
        await RefreshToken.deleteByUserId(userId);
    }
}

module.exports = AuthService;
