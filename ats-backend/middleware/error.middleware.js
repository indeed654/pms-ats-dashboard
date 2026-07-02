// Global error handler middleware
function errorHandler(err, req, res, next) {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        user: req.user ? req.user.userId : 'unauthenticated'
    });

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    
    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error: ' + err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.code === 11000) {
        statusCode = 409;
        message = 'Duplicate entry error';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }

    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    const errorResponse = {
        status: "N",
        error: message,
        ...(isDevelopment && { stack: err.stack })
    };

    res.status(statusCode).json(errorResponse);
}

// 404 handler
function notFoundHandler(req, res, next) {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
}

module.exports = {
    errorHandler,
    notFoundHandler
};