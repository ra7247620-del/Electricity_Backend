const ResponseHandler = require('../utils/response');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return ResponseHandler.error(res, err.message, 400);
    }

    if (err.name === 'UnauthorizedError') {
        return ResponseHandler.error(res, 'Unauthorized', 401);
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return ResponseHandler.error(res, 'Duplicate entry', 409);
    }

    return ResponseHandler.error(res, 'Internal server error', 500, err.message);
};

module.exports = errorHandler;
