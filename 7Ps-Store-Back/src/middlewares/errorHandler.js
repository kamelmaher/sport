
/**
 * Validate a request body against a given schema. If the validation fails, send
 * a 400 response with the validation errors. If the validation succeeds, assign
 * the validated body to req.body and call next() to continue the request
 * handling.
 *
 * @param {Joi.Schema} schema
 * @return {Function} middleware function
 */
const validate = (schema) => {
    return (req, res, next) => {
      const { error, value } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
        return res.status(400).json({
          message: 'Validation error',
          details: error.details.map(e => e.message)
        });
      }
  
      req.body = value;
      next();
    };
  };
  
  module.exports = validate;