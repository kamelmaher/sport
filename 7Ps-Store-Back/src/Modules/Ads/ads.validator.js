const Joi = require('joi');

const createAdSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    link: Joi.string().uri().required()
});

const updateAdSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    link: Joi.string().uri()
}).min(1);

module.exports = {
    createAdSchema,
    updateAdSchema
};