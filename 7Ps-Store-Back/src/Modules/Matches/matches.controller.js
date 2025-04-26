const NodeCache = require('node-cache');
const moment = require('moment-timezone');
const cache = new NodeCache();

const { initPlaywrightBrowser } = require('../../scraper/initPlaywrightBrowser');
const { initPlaywrightPage } = require('../../scraper/initPlaywrightPage');
const { getPageLink } = require('../../helpers/getPageLink');
const { getSupportedCompetitions } = require('../../helpers/getSupportedCompetitions');
const { scrapeCompetitions } = require('../../scraper/scrapeCompetitions');
const { getDate } = require('../../helpers/getDate');

module.exports = {
  getMatches: async (req, res) => {
    const cacheKey = 'matches_data';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('Serving from cache');
      return res.json(cachedData);
    }

    let browser;
    try {
      const liveOnSatPageUrl = getPageLink();
      const supportedCompetitions = getSupportedCompetitions();
      const timeout = Number(process.env.PLAYWRIGHT_TIMEOUT);
      const timezone = 'Asia/Riyadh'; // Fixed timezone to Makkah
      const date = getDate().today(); // Ensure this returns date in Makkah timezone

      browser = await initPlaywrightBrowser();
      const page = await initPlaywrightPage(browser);

      await page.goto(liveOnSatPageUrl, { 
        timeout: timeout,
        waitUntil: 'networkidle'
      });

      // Set the timezone to Makkah on the page
      await page.waitForSelector('#selecttz');
      await page.locator('#selecttz').selectOption(timezone);
      await page.waitForLoadState('networkidle');

      const competitions = await scrapeCompetitions(page, supportedCompetitions);

      await browser.close();

      const responseData = { date, competitions };

      const ttl = 1800; // Cache for 30 minutes
      console.log(`Caching data for ${ttl} seconds `);

      cache.set(cacheKey, responseData, ttl);

      res.json(responseData);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ 
        error: 'Failed to scrape data',
        message: error.message 
      });
    } finally {
      if (browser) {
        await browser.close().catch(console.error);
      }
    }
  }
};