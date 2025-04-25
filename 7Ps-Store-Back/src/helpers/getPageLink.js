const path = require('path');
const { getDate } = require('./getDate');
const { isProduction } = require('./isProduction');

// Add default fallback path
const samplePage = process.env.PLAYWRIGHT_SAMPLE_PAGE_PATH 
  ? path.resolve(process.env.PLAYWRIGHT_SAMPLE_PAGE_PATH)
  : path.resolve('./sample.html');

module.exports.getPageLink = () => {
  const { en } = getDate().today();

  const liveOnSatLink = 'https://liveonsat.com/2day.php';
  const todaysLink = `${liveOnSatLink}?start_dd=${en.day}&start_mm=${en.month}&start_yyyy=${en.year}&end_dd=${en.day}&end_mm=${en.month}&end_yyyy=${en.year}`;

  return isProduction() ? todaysLink : samplePage;
};