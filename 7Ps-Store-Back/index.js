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
  origin: ['http://localhost:4200', 'https://7ps-store.netlify.app', process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Access-Control-Allow-Headers', 'Content-Type', 'Authorization']
}));

// Database connection
connection();

// Routes
app.use('/api/channels', channelRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);

// Schedule Yalla Kora scraping every 20 minutes
cron.schedule('*/20 * * * *', async () => {
  console.log('Running scheduled Yalla Kora scraping at', new Date().toISOString());
  try {
    await MatchesController.scrapeYallaKoraFinishedMatches();
    console.log('Scheduled Yalla Kora scraping completed successfully');
  } catch (error) {
    console.error('Scheduled Yalla Kora scraping failed:', error);
  }
});

// Schedule LiveOnSat scraping every 3 hours
cron.schedule('0 */3 * * *', async () => {
  console.log('Running scheduled LiveOnSat scraping at', new Date().toISOString());
  try {
    await MatchesController.scrapeAndCacheData();
    console.log('Scheduled LiveOnSat scraping completed successfully');
  } catch (error) {
    console.error('Scheduled LiveOnSat scraping failed:', error);
  }
});

// Run the scraping jobs immediately on server start
(async () => {
  console.log('Running initial scraping jobs on server start...');
  try {
    await MatchesController.scrapeYallaKoraFinishedMatches();
    console.log('Initial Yalla Kora scraping completed successfully');

    await MatchesController.scrapeAndCacheData();
    console.log('Initial LiveOnSat scraping completed successfully');
  } catch (error) {
    console.error('Initial scraping failed:', error);
  }
})();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
