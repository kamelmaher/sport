const express = require('express');
require('dotenv').config();
const channelRoutes = require('./src/Modules/Channels/channel.routes');
const matchesRoutes = require('./src/Modules/Matches/matches.routes');
const userRoutes = require('./src/Modules/Users/user.routes');
const adRoutes = require('./src/Modules/Ads/ads.routes');
const connection = require('./DB/connection');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const MatchesController = require('./src/Modules/Matches/matches.controller');



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connection
connection();

// Routes
app.use('/api/channels', channelRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);

// Schedule the scraping job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled scraping jobs at', new Date().toISOString());
  try {
    // Scrape LiveOnSat data
    await MatchesController.scrapeAndCacheData();
    console.log('Scheduled LiveOnSat scraping completed successfully');

    // Scrape Yalla Kora finished matches
    await MatchesController.scrapeYallaKoraFinishedMatches();
    console.log('Scheduled Yalla Kora finished matches scraping completed successfully');
  } catch (error) {
    console.error('Scheduled scraping failed:', error);
  }
});

// Run the scraping job immediately on server start
(async () => {
  console.log('Running initial scraping jobs on server start...');
  try {
    await MatchesController.scrapeAndCacheData();
    console.log('Initial LiveOnSat scraping completed successfully');

    await MatchesController.scrapeYallaKoraFinishedMatches();
    console.log('Initial Yalla Kora finished matches scraping completed successfully');
  } catch (error) {
    console.error('Initial scraping failed:', error);
  }
})();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});