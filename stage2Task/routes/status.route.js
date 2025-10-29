const express = require('express');
const router = express.Router();
const { getStatus } = require('../controller/status.controller');

// GET /status
router.get('/', getStatus);

module.exports = router;