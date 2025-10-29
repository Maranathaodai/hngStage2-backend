const Country = require("../models/country");
const CountryService = require("../utils/countryService");
const fs = require('fs');
const ImageService = require("../utils/imageService");



// POST /countries/refresh
const refresh = async (req, res, next) => {
    try {

        const result = await CountryService.refreshCountries(); // Call the service method

        res.json(result); // Send the result as response

    } catch (error) {
        next(error);
    }
};

// GET /countries
const getCountries = async (req, res, next) => {
    try {
        // Get query parameters        
        const { region, currency, sort } = req.query;
        const filters = { region, currency, sort }; // Build filters object

        // Find countries with filters     
        const countries = await Country.findAll(filters);

        // Send response
        res.json(countries);
        
    } catch (error) {
        next(error);
    }
};

// GET /countries/:name
const getCountryByName  = async (req, res, next) => {
    try {
        // Find country by name
        const country = await Country.findByName(req.params.name);
        // If not found, send 404
        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }
        res.json(country);
    } catch (error) {
        next(error);
    }
};

// DELETE /countries/:name
const deleteCountryByName = async (req, res, next) => {
    try {
        // Delete country by name
        const deleted = await Country.deleteByName(req.params.name);
        // If not found, send 404
        if (!deleted) {
            return res.status(404).json({ error: 'Country not found' });
        }
        // Send success response
        res.json({ message: 'Country deleted successfully' });
    } catch (error) {
        next(error);
    }
};


// GET /countries/image
const getCountryImage = async (req, res, next) => {
    try {
        // Check if image exists
        if (!ImageService.imageExists()) {
            return res.status(404).json({ error: 'Summary image not found' });
        }
        // Send the image file
        const imagePath = ImageService.getImagePath();
        res.sendFile(imagePath);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    refresh,
    getCountries,
    getCountryByName,
    deleteCountryByName,
    getCountryImage

}