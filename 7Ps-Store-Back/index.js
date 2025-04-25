const express = require('express');
const channelRoutes = require('../7Ps-Store-Back/src/Modules/Channels/channel.routes');
const userRoutes = require('../7Ps-Store-Back/src/Modules/Users/user.routes');
const adRoutes = require('../7Ps-Store-Back/src/Modules/Ads/ads.routes');
const connection = require('./DB/connection');
const app = express();
const cors = require('cors');
require('dotenv').config();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // هذا السطر مهم للنصوص العربية


app.use(cors({
  origin: 'http://localhost:4200', // Allow only the Angular frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));


// Database connection
connection();

// Routes
app.use('/api/channels', channelRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ads', adRoutes);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});