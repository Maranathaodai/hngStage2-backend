const express = require('express');
const router = express.Router();
const { refresh, getCountries, 
    getCountryByName, 
    deleteCountryByName, 
    getCountryImage } = require('../controller/country.controller');

// POST /countries/refresh
router.post('/refresh', refresh )

// GET /countries
router.get('/', getCountries);

// GET /countries/:name
router.get('/:name', getCountryByName);

// DELETE /countries/:name
router.delete('/:name', deleteCountryByName );

// GET /countries/image
router.get('/image', getCountryImage );

module.exports = router;