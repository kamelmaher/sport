const express = require('express');
const router = express.Router();
const channelController = require('../Channels/channel.controler');
const authMiddleware = require('../../middlewares/authMiddleware');
const adminFilter = require('../../middlewares/adminMiddleware');
const { createChannelSchema, updateChannelSchema } = require('../Channels/channel.validator');
const validate = require('../../middlewares/errorHandler');
// Create a new channel
router.post('/', authMiddleware, adminFilter, validate(createChannelSchema), channelController.createChannel);

// Get all channels
router.get('/', authMiddleware, channelController.searchChannels);

// Get Arab countries for filtering
router.get('/arab-countries', channelController.getArabCountries);

// Import multiple channels
router.post('/import', authMiddleware, adminFilter, channelController.importChannels);

// Get a single channel by ID
router.get('/:id', authMiddleware, channelController.getChannelById);

// Update a channel
router.put('/:id', authMiddleware, adminFilter, validate(updateChannelSchema), channelController.updateChannel);

// Delete a channel
router.delete('/:id', authMiddleware, adminFilter, channelController.deleteChannel);

module.exports = router;