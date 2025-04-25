function isProduction() {
    return process.env.IS_PRODUCTION === 'true';
  }
  
  module.exports = { isProduction };