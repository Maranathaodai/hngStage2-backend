
const errorHandler = async (err, req, res, next) => {
    
    console.error(err);

    if (err.status) {
        return res.status(err.status).json({
            error: err.message,
            details: err.details
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.details
        });
    }

    // MySQL errors
    if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            error: 'Invalid data provided',
            details: err.sqlMessage
        });
    }

    res.status(500).json({
        error: 'Internal server error'
    });
}

module.exports = errorHandler;