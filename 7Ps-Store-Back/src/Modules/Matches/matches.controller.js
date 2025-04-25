const { initPlaywrightBrowser } = require('../../scraper/initPlaywrightBrowser');
const { initPlaywrightPage } = require('../../scraper/initPlaywrightPage');
const { getPageLink } = require('../../helpers/getPageLink');
const { getSupportedCompetitions } = require('../../helpers/getSupportedCompetitions');
const { scrapeCompetitions } = require('../../scraper/scrapeCompetitions');
const { getDate } = require('../../helpers/getDate');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

module.exports = {
    getMatches: async (req, res) => {
      const cacheKey = 'matches_data';
      const cachedData = cache.get(cacheKey);
  
      // Check if data exists in cache
      if (cachedData) {
        console.log('Serving from cache');
        return res.json(cachedData);
      }
  
      let browser;
      try {
        // Settings
        const liveOnSatPageUrl = getPageLink();
        const supportedCompetitions = getSupportedCompetitions();
        const timeout = Number(process.env.PLAYWRIGHT_TIMEOUT);
        const timezone = process.env.PLAYWRIGHT_TIMEZONE;
        const date = getDate().today();
  
        // Initialize browser and page
        browser = await initPlaywrightBrowser();
        const page = await initPlaywrightPage(browser);
  
        // Navigate with timeout
        await page.goto(liveOnSatPageUrl, { 
          timeout: timeout,
          waitUntil: 'networkidle'
        });
  
        // Set timezone
        await page.waitForSelector('#selecttz');
        await page.locator('#selecttz').selectOption(timezone);
        await page.waitForLoadState('networkidle');
  
        // Scrape competitions
        const competitions = await scrapeCompetitions(page, supportedCompetitions);
  
        // Close browser
        await browser.close();
  
        // Prepare response data
        const responseData = { date, competitions };
  
        // Store in cache
        cache.set(cacheKey, responseData);
  
        // Return data
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