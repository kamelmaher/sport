const express = require('express');
const channelRoutes = require('../7Ps-Store-Back/src/Modules/Channels/channel.routes');
const connection = require('./DB/connection');
const app = express();

require('dotenv').config();
// Middleware
app.use(express.json());

const multer = require('multer');

// Set higher limits for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  // Your upload handler
});
// Database connection
connection();

// Routes
app.use('/api/channels', channelRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});