// index.js startup sequence improvements
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
// ['https://7ps-store.netlify.app', 'http://localhost:4200', process.env.FRONTEND_URL]
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.options('*', cors());

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
cron.schedule('*/10 * * * *', async () => {
  console.log('Running scheduled LiveOnSat scraping at', new Date().toISOString());
  try {
    await MatchesController.scrapeAndCacheData();
    console.log('Scheduled LiveOnSat scraping completed successfully');
  } catch (error) {
    console.error('Scheduled LiveOnSat scraping failed:', error);
  }
});

// // Run the scraping jobs in sequence with delayed startup
async function runInitialScrapingJobs() {
  console.log('Beginning initial data scraping after server startup...');

  //   // Wait a moment for server to fully initialize
  await new Promise(resolve => setTimeout(resolve, 5000));

  //   // Run Yalla Kora scraping first
  try {
    console.log('Starting initial Yalla Kora scraping...');
    await MatchesController.scrapeYallaKoraFinishedMatches();
    console.log('Initial Yalla Kora scraping completed successfully');
  } catch (error) {
    console.error('Initial Yalla Kora scraping failed:', error.message);
  }

  // Short delay between jobs
  await new Promise(resolve => setTimeout(resolve, 5000));

  //   // Then run LiveOnSat scraping
  try {
    console.log('Starting initial LiveOnSat scraping...');
    await MatchesController.scrapeAndCacheData();
    console.log('Initial LiveOnSat scraping completed successfully');
  } catch (error) {
    console.error('Initial LiveOnSat scraping failed:', error.message);
  }

  console.log('Initial data scraping sequence completed.');
}

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start initial scraping after server is ready
  runInitialScrapingJobs().catch(error => {
    console.error('Error in initial scraping sequence:', error.message);
  });
});



// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});