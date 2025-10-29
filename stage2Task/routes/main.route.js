const express = require('express');
const router = express.Router();
const countryRoutes = require('./country.route');
const statusRoutes = require('./status.route');

router.use('/countries', countryRoutes);
router.use('/status', statusRoutes);

module.exports = router;