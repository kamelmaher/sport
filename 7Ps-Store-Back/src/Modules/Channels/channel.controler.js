const Channel = require('../Channels/channel.model');
const { createChannelSchema, updateChannelSchema } = require('../Channels/channel.validator');

// Helper function to normalize input (convert single object to array)
const normalizeInput = (data) => {
  if (data) {
    return {
      ...data,
      satellite_info: Array.isArray(data.satellite_info) ? 
        data.satellite_info : 
        [data.satellite_info],
      technical_info: Array.isArray(data.technical_info) ? 
        data.technical_info : 
        [data.technical_info]
    };
  }
  return data;
};

// Create a new channel
const createChannel = async (req, res) => {
  try {
    const normalizedBody = normalizeInput(req.body);
    const { error } = createChannelSchema.validate(normalizedBody);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const channel = new Channel(normalizedBody);
    await channel.save();
    
    res.status(201).json(channel);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Channel name already exists' });
    }
    res.status(500).json({ 
      error: 'Failed to create channel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Import multiple channels at once
const importChannels = async (req, res) => {
    try {
        const { channels } = req.body;
        
        if (!Array.isArray(channels)) {
            return res.status(400).json({ error: 'Input should be an array of channels' });
        }

        // Initialize tracking collections
        const validationErrors = [];
        const validChannels = [];
        const skippedChannels = [];
        const duplicateNames = new Set();
        const nameCounts = {};

        // First pass: Count occurrences of each channel name
        channels.forEach(channel => {
            const name = channel.channel_name || 'Unnamed channel';
            nameCounts[name] = (nameCounts[name] || 0) + 1;
        });

        // Second pass: Process channels
        const seenNames = new Set();
        for (const channel of channels) {
            const channelName = channel.channel_name || 'Unnamed channel';

            // Ensure eirp.text exists, even if empty
            if (channel.technical_info) {
                channel.technical_info.eirp = channel.technical_info.eirp || {};
                channel.technical_info.eirp.text = channel.technical_info.eirp.text || '';
            }
            // Skip channels with missing logo URL
            if (!channel.logo?.url) {
                skippedChannels.push({
                    channel: channelName,
                    reason: 'Missing logo URL'
                });
                continue;
            }

            // Normalize the channel data
            const normalizedChannel = normalizeInput(channel);

            // Validate channel structure
            const { error } = createChannelSchema.validate(normalizedChannel);
            if (error) {
                validationErrors.push({
                    channel: channelName,
                    error: error.details[0].message
                });
                continue;
            }

            // Only keep the first occurrence of each channel name
            if (seenNames.has(channelName)) {
                if (nameCounts[channelName] > 1) {
                    skippedChannels.push({
                        channel: channelName,
                        reason: 'Duplicate in request - keeping first occurrence only'
                    });
                }
                continue;
            }

            seenNames.add(channelName);

            // Only use the first satellite_info and technical_info
            const simplifiedChannel = {
                ...normalizedChannel,
                satellite_info: normalizedChannel.satellite_info[0],
                technical_info: normalizedChannel.technical_info[0]
            };

            validChannels.push(simplifiedChannel);
        }

        // Check database for existing channels
        const channelNames = validChannels.map(c => c.channel_name);
        const existingChannels = await Channel.find({
            channel_name: { $in: channelNames }
        });

        // Add existing channels to skipped list
        existingChannels.forEach(channel => {
            skippedChannels.push({
                channel: channel.channel_name,
                reason: 'Already exists in database'
            });
        });

        // Filter out existing channels
        const existingChannelNames = existingChannels.map(c => c.channel_name);
        const channelsToImport = validChannels.filter(channel => 
            !existingChannelNames.includes(channel.channel_name)
        );

        // Handle case where no channels to import
        if (channelsToImport.length === 0) {
            return res.status(200).json({
                message: 'No new channels to import',
                stats: {
                    totalReceived: channels.length,
                    skipped: skippedChannels.length,
                    validationErrors: validationErrors.length
                },
                skippedChannels,
                validationErrors: validationErrors.length ? validationErrors : undefined
            });
        }

        // Insert new channels
        const insertedChannels = await Channel.insertMany(channelsToImport);
        
        res.status(201).json({
            message: 'Channels imported successfully',
            stats: {
                totalReceived: channels.length,
                imported: insertedChannels.length,
                skipped: skippedChannels.length,
                validationErrors: validationErrors.length
            },
            importedChannels: insertedChannels.map(c => c.channel_name),
            skippedChannels,
            validationErrors: validationErrors.length ? validationErrors : undefined
        });

    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to import channels',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};



// Get channels by country
  const getChannelsByCountry = async (req, res) => {
    try {
      const { country } = req.params;
      const { page = 1, limit = 10, sortBy = 'channel_name', sortOrder = 'asc' } = req.query;
  
      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  
      const channels = await Channel.find({
        'metadata.country': { 
          $regex: new RegExp(`^${country}$`, 'i') 
        }
      })
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);
  
      const count = await Channel.countDocuments({
        'metadata.country': { 
          $regex: new RegExp(`^${country}$`, 'i') 
        }
      });
  
      if (channels.length === 0) {
        return res.status(404).json({
          message: 'No channels found for this country',
          country: country
        });
      }
  
      res.json({
        count: channels.length,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        country: country,
        channels: channels
      });
  
    } catch (err) {
      res.status(500).json({ 
        error: 'Failed to fetch channels by country',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };


// Get all channels with optional pagination
const getAllChannels = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const channels = await Channel.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Channel.countDocuments();

    res.json({
      channels,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch channels',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get a single channel by ID
const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json(channel);
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch channel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update a channel
const updateChannel = async (req, res) => {
  try {
    const { error } = updateChannelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const channel = await Channel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    res.json(channel);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Channel name already exists' });
    }
    res.status(500).json({ 
      error: 'Failed to update channel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete a channel
const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findByIdAndDelete(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }
    res.json({ 
      message: 'Channel deleted successfully',
      deletedChannel: channel.channel_name
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to delete channel',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  createChannel,
  importChannels,
  getAllChannels,
  getChannelById,
  updateChannel,
  deleteChannel
};