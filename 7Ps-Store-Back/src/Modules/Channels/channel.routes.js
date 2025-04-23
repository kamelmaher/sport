const express = require('express');
const router = express.Router();
const channelController = require('../Channels/channel.controler');

// Create a new channel
router.post('/', channelController.createChannel);

// Get all channels
router.get('/', channelController.getAllChannels);

// Import multiple channels
router.post('/import', channelController.importChannels);

// Get channels by country
router.get('/country/:country', channelController.getChannelsByCountry);
// Get a single channel by ID
router.get('/:id', channelController.getChannelById);

// Update a channel
router.put('/:id', channelController.updateChannel);

// Delete a channel
router.delete('/:id', channelController.deleteChannel);

module.exports = router;