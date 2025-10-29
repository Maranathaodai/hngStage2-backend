const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const mainRoutes = require('./routes/main.route')
const errorHandler = require('./middlewares/errorHandler');
const connectDB = require('./database/dbConfig');
// const countriesRoutes = require('./routes/country.route')
// const statusRoute = require('./routes/status.route')

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
// connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', mainRoutes);
// app.use('/countries', countriesRoutes);
// app.use('/status', statusRoute);

// Error handling
app.use(errorHandler);

//PORT LISTEN
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Add error handling for the server Or any unhandled exceptions
app.on('error', (err) => {
    if (err.code === 'EACCES') {
        console.error(`Permission denied on port ${PORT}. Try running with elevated privileges or using a different port.`);
        process.exit(1);
    } else if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Choose a different port.`);
        process.exit(1);
    } else {
        console.error('Unhandled server error:', err);
        process.exit(1);
    }
});

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});


module.exports = app;