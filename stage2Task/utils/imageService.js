const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const Country = require('../models/country');

// Utility class for generating and managing summary images
class ImageService {
    static async generateSummaryImage() {
        const stats = await Country.getStats();
        const topCountries = await Country.findAll({ sort: 'gdp_desc' });
        
        const canvas = createCanvas(800, 600);
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 800, 600);

        // Title
        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Countries Summary', 50, 50);

        // Total countries
        ctx.font = '18px Arial';
        ctx.fillText(`Total Countries: ${stats.total_countries}`, 50, 100);

        // Last refresh
        ctx.fillText(`Last Refresh: ${new Date(stats.last_refreshed_at).toLocaleString()}`, 50, 130);

        // Top 5 countries by GDP
        ctx.fillText('Top 5 Countries by GDP:', 50, 180);
        
        let yPosition = 210;
        topCountries.slice(0, 5).forEach((country, index) => {
            ctx.font = '14px Arial';
            ctx.fillText(
                `${index + 1}. ${country.name}: $${(country.estimated_gdp / 1e9).toFixed(2)}B`,
                70,
                yPosition
            );
            yPosition += 25;
        });

        // Ensure cache directory exists
        const cacheDir = path.join(__dirname, '../cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        // Save image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(path.join(cacheDir, 'summary.png'), buffer);
    }

    static getImagePath() {
        return path.join(__dirname, '../cache/summary.png');
    }

    static imageExists() {
        return fs.existsSync(this.getImagePath());
    }
};

module.exports = ImageService;