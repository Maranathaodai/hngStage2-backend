const axios = require('axios');
const Country = require('../models/country');
const { calculateEstimatedGDP } = require('./exchangeService');
const { generateSummaryImage } = require('./imageService');

class CountryService {
    static async refreshCountries() {
        try {
            // Fetch countries data
            const countriesResponse = await axios.get(
                'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies'
            );

            // Fetch exchange rates
            const exchangeResponse = await axios.get(
                'https://open.er-api.com/v6/latest/USD'
            );

            const exchangeRates = exchangeResponse.data.rates;

            for (const country of countriesResponse.data) {
                let currencyCode = null;
                let exchangeRate = null;
                let estimatedGDP = 0;

                if (country.currencies && country.currencies.length > 0) {
                    currencyCode = country.currencies[0].code;
                    
                    if (currencyCode && exchangeRates[currencyCode]) {
                        exchangeRate = exchangeRates[currencyCode];
                        estimatedGDP = calculateEstimatedGDP(country.population, exchangeRate);
                    }
                }

                const countryData = {
                    name: country.name,
                    capital: country.capital,
                    region: country.region,
                    population: country.population,
                    currency_code: currencyCode,
                    exchange_rate: exchangeRate,
                    estimated_gdp: estimatedGDP,
                    flag_url: country.flag
                };

                await Country.upsert(countryData);
            }

            // Generate summary image after refresh
            await generateSummaryImage();

            return { success: true, message: 'Countries refreshed successfully' };
        } catch (error) {
            if (error.response) {
                throw {
                    status: 503,
                    message: 'External data source unavailable',
                    details: `Could not fetch data from ${error.config.url}`
                };
            }
            throw error;
        }
    }
}

module.exports = CountryService;