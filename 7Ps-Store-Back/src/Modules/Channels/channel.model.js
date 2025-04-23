const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true
  }
});

const satelliteInfoSchema = new mongoose.Schema({
  position: {
    type: String,
    required: true
  },
  position_value: {
    type: Number,
    required: true
  },
  position_direction: {
    type: String,
    required: true,
    enum: ['W', 'E', 'N', 'S']
  },
  satellite_name: {
    type: String,
    default: null
  }
}, { _id: false });

const eirpSchema = new mongoose.Schema({
  text: {
    type: String,
    default: "", // Allow empty string
    required: false // Make it optional
  },
  value: {
    type: Number,
    default: null
  }
}, { _id: false });

const frequencySchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, { _id: false });

const technicalInfoSchema = new mongoose.Schema({
  beam: {
    type: String,
    required: true
  },
  eirp: {
    type: eirpSchema,
    required: true
  },
  frequency: {
    type: frequencySchema,
    required: true
  }
}, { _id: false });

const metaDataSchema = new mongoose.Schema({
  source: {
    type: String,
    default: null
  },
  scraped_at: {
    type: Date,
    default: Date.now
  },
  country: {
    type: String,
    default: null
  }
}, { _id: false });

const channelSchema = new mongoose.Schema({
  channel_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  logo: {
    type: logoSchema,
    required: true
  },
  satellite_info: {
    type: [satelliteInfoSchema], // Changed to array
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one satellite info is required'
    }
  },
  technical_info: {
    type: [technicalInfoSchema], // Changed to array
    required: true,
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'At least one technical info is required'
    }
  },
  metadata: {
    type: metaDataSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      if (ret.metadata?.scraped_at instanceof Date) {
        ret.metadata.scraped_at = ret.metadata.scraped_at.toISOString();
      }
      return ret;
    }
  }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;