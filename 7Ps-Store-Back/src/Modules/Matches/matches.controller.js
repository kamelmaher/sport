const { initPlaywrightBrowser } = require('../../scraper/initPlaywrightBrowser');
const { initPlaywrightPage } = require('../../scraper/initPlaywrightPage');
const { getPageLink } = require('../../helpers/getPageLink');
const { getSupportedCompetitions } = require('../../helpers/getSupportedCompetitions');
const { scrapeCompetitions } = require('../../scraper/scrapeCompetitions');
const { getDate } = require('../../helpers/getDate');

module.exports = {
  getMatches: async (req, res) => {
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

      // Return data
      res.json({ date, competitions });
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