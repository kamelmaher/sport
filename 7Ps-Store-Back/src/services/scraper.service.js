const { initPlaywrightBrowser } = require('../scraper/initPlaywrightBrowser');
const { initPlaywrightPage } = require('../scraper/initPlaywrightPage');
const { getPageLink } = require('../helpers/getPageLink');
const { getSupportedCompetitions } = require('../helpers/getSupportedCompetitions');
const { scrapeCompetitions } = require('../scraper/scrapeCompetitions');
const { getDate } = require('../helpers/getDate');
const moment = require('moment-timezone');

class ScraperService {
  static async scrapeLiveOnSat() {
    let browser;
    try {
      const liveOnSatPageUrl = getPageLink();
      const supportedCompetitions = getSupportedCompetitions();
      const timeout = Number(process.env.PLAYWRIGHT_TIMEOUT) || 30000;
      const timezone = 'Asia/Riyadh';
      const date = getDate().today();

      browser = await initPlaywrightBrowser();
      const page = await initPlaywrightPage(browser);

      await page.goto(liveOnSatPageUrl, { 
        timeout: timeout,
        waitUntil: 'networkidle'
      });

      await page.waitForSelector('#selecttz', { timeout: 15000 });
      await page.locator('#selecttz').selectOption(timezone);
      await page.waitForLoadState('networkidle', { timeout: 15000 });

      const competitions = await scrapeCompetitions(page, supportedCompetitions);
      return { date, competitions };
    } finally {
      if (browser) await browser.close().catch(console.error);
    }
  }

  static async scrapeYallaKora() {
    let browser;
    try {
      const date = moment().tz('Asia/Riyadh').format('MM/DD/YYYY');
      const urlDate = date.replace(/\//g, '-');
      const url = `https://www.yallakora.com/match-center/?date=${urlDate}`;

      browser = await initPlaywrightBrowser();
      const page = await initPlaywrightPage(browser);

      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      });

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 45000
      });

      await page.waitForLoadState('networkidle', { timeout: 30000 })
        .catch(() => console.log('Network not completely idle, continuing anyway'));

      await page.waitForSelector('div.matchCard', { timeout: 15000, state: 'visible' })
        .catch(() => console.log('No matches found for this date'));

      const matches = await page.evaluate((date) => {
        // ... (keep existing evaluate logic)
      }, date);

      return { date, matches };
    } finally {
      if (browser) await browser.close().catch(console.error);
    }
  }
}

module.exports = ScraperService;