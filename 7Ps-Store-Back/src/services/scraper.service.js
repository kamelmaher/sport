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
      // const url = `https://www.yallakora.com/match-center/?date=${urlDate}`;
      const url = `https://www.yallakora.com/match-center/?date=04-26-2025`;

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
        const finishedMatches = [];

        const championships = document.querySelectorAll('div.matchCard');
        for (const championship of championships) {
          let championshipTitle;
          try {
            championshipTitle = championship.querySelector('h2')?.textContent.trim() || 'Unknown Championship';
          } catch (e) {
            console.error('Error getting championship title:', e);
            continue;
          }

          const matchElements = championship.querySelectorAll('div.item.liItem');
          for (const match of matchElements) {
            try {
              const matchStatus = match.querySelector('div.matchStatus > span')?.textContent.trim();
              if (matchStatus !== 'انتهت') {
                continue;
              }

              const teamA = match.querySelector('div.teamA')?.textContent.trim() || 'N/A';
              const teamB = match.querySelector('div.teamB')?.textContent.trim() || 'N/A';

              const matchResultDiv = match.querySelector('div.MResult');
              const matchTime = matchResultDiv?.querySelector('span.time')?.textContent.trim() || 'N/A';

              const scoreSpans = match.querySelectorAll('span.score');
              let score = 'N/A';
              if (scoreSpans.length === 2) {
                score = `${scoreSpans[0].textContent.trim()} - ${scoreSpans[1].textContent.trim()}`;
              }

              const channel = match.querySelector('div.channel')?.textContent.trim() || 'N/A';

              finishedMatches.push({
                championship: championshipTitle,
                team_a: teamA,
                team_b: teamB,
                match_time: matchTime,
                score: score,
                channel: channel,
                status: 'انتهت',
                date: date
              });
            } catch (e) {
              console.error('Error processing match:', e);
            }
          }
        }

        return finishedMatches;
      }, date);

      return { date, matches };
    } finally {
      if (browser) await browser.close().catch(console.error);
    }
  }
}

module.exports = ScraperService;