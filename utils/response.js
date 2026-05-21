class ResponseHandler {
    static success(res, message = 'Success', data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = 'Error occurred', statusCode = 500, error = null) {
        const response = {
            success: false,
            message
        };

        if (error && process.env.NODE_ENV === 'development') {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }
}

module.exports = ResponseHandler;
