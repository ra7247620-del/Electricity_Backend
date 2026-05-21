const JWTHandler = require('../utils/jwt');
const ResponseHandler = require('../utils/response');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseHandler.error(res, 'Access token required', 401);
        }

        const token = authHeader.substring(7);
        const decoded = JWTHandler.verifyAccessToken(token);
        
        req.user = decoded;
        next();
    } catch (error) {
        return ResponseHandler.error(res, 'Invalid or expired token', 401);
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return ResponseHandler.error(res, 'Admin access required', 403);
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
