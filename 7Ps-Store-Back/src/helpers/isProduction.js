// helpers/isProduction.js
function isProduction() {
  // More robust check for production environment
  return process.env.IS_PRODUCTION === 'true' || process.env.NODE_ENV === 'production';
}

module.exports = { isProduction };