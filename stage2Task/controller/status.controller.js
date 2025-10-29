const Country = require("../models/country");

// GET /status
const getStatus = async (req, res, next) => {
    try {
        const stats = await Country.getStats();

        res.json({
            total_countries: stats.total_countries,
            last_refreshed_at: stats.last_refreshed_at
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStatus
};