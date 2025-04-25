const Joi = require('joi');

const logoSchema = Joi.object({
  url: Joi.string().uri().required()
});

const satelliteInfoSchema = Joi.object({
  position: Joi.string().required(),
  position_value: Joi.number().required(),
  position_direction: Joi.string().valid('W', 'E', 'N', 'S').required(),
  satellite_name: Joi.string().allow('', null)
});

const eirpSchema = Joi.object({
  text: Joi.string().allow('', null), // Allow empty string or null
  value: Joi.number().allow(null) // Keep existing value validation
});


const frequencySchema = Joi.object({
  text: Joi.string().required(),
  value: Joi.number().required()
});

const technicalInfoSchema = Joi.object({
  beam: Joi.string().required(),
  eirp: Joi.object({
    text: Joi.string().allow('', null).optional(),
    value: Joi.number().allow(null).optional()
  }).optional(), // Make the entire eirp object optional
  frequency: frequencySchema.required()
});

const metaDataSchema = Joi.object({
  source: Joi.string().allow('', null),
  scraped_at: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.string().isoDate()
  ).default(() => new Date().toISOString()),
  country: Joi.string().allow('', null)
}).optional();

const createChannelSchema = Joi.object({
  channel_name: Joi.string().required(),
  logo: logoSchema.required(),
  satellite_info: Joi.alternatives().try(
    satelliteInfoSchema,
    Joi.array().items(satelliteInfoSchema).min(1)
  ).required(),
  technical_info: Joi.alternatives().try(
    technicalInfoSchema,
    Joi.array().items(technicalInfoSchema).min(1)
  ).required(),
  metadata: metaDataSchema
});

const updateChannelSchema = Joi.object({
  channel_name: Joi.string(),
  logo: logoSchema,
  satellite_info: Joi.alternatives().try(
    satelliteInfoSchema,
    Joi.array().items(satelliteInfoSchema).min(1)
  ),
  technical_info: Joi.alternatives().try(
    technicalInfoSchema,
    Joi.array().items(technicalInfoSchema).min(1)
  ),
  metadata: metaDataSchema
}).min(1);

module.exports = {
  createChannelSchema,
  updateChannelSchema
};