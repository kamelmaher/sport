// src/services/scraper.service.js
const { initPlaywrightBrowser } = require('../scraper/initPlaywrightBrowser');
const { initPlaywrightPage } = require('../scraper/initPlaywrightPage');
const { getPageLink } = require('../helpers/getPageLink');
const { getSupportedCompetitions } = require('../helpers/getSupportedCompetitions');
const { getSupportedYallaKoraCompetitions } = require('../helpers/getSupportedYallaKoraCompetitions');
const { scrapeCompetitions } = require('../scraper/scrapeCompetitions');
const { getDate } = require('../helpers/getDate');
const moment = require('moment-timezone');
const { convertToMeccaTime } = require('../helpers/timeConverter');
const CacheService = require('./cache.service');
const path = require('path');  

class ScraperService {
  static liveOnSatCache = new CacheService(
    path.join(__dirname, '../cache/liveonsat.json'),
    1800000 // 30 minutes TTL
  );

  static yallaKoraCache = new CacheService(
    path.join(__dirname, '../cache/yallakora.json'),
    1800000 // 30 minutes TTL
  );
  static async scrapeLiveOnSat() {
    let browser;
    let retries = 4; // Allow 3 attempts total (initial + 2 retries)
    
    while (retries >= 0) {
      try {
        const liveOnSatPageUrl = getPageLink();
        const supportedCompetitions = getSupportedCompetitions();
        const timeout = Number(process.env.PLAYWRIGHT_TIMEOUT) || 60000;
        const timezone = 'Asia/Riyadh';
        const date = getDate().today();

        console.log(`LiveOnSat scraping attempt ${2-retries+1}/5`);
        browser = await initPlaywrightBrowser();
        const page = await initPlaywrightPage(browser);

        console.log('Navigating to LiveOnSat page:', liveOnSatPageUrl);
        await page.goto(liveOnSatPageUrl, {
          timeout: timeout,
          waitUntil: 'domcontentloaded',
        });

        console.log('Waiting for timezone selector...');
        await page.waitForSelector('#selecttz', {
          timeout: 30000,
          state: 'visible'
        }).catch(() => console.log('Timezone selector not found, continuing...'));

        if (await page.$('#selecttz')) {
          await page.locator('#selecttz').selectOption(timezone);
          await page.waitForLoadState('networkidle', { timeout: 30000 })
            .catch(() => console.log('Network not completely idle after timezone change'));
        }

        console.log('Scraping competitions...');
        const competitions = await scrapeCompetitions(page, supportedCompetitions);
        await browser.close().catch(console.error);
        return { date, competitions };
      } catch (error) {
        console.error(`LiveOnSat scraping attempt failed (${2-retries+1}/5):`, error.message);
        if (browser) await browser.close().catch(console.error);
        
        retries--;
        if (retries < 0) {
          console.error('All LiveOnSat scraping attempts failed');
          const fallbackData = await this.liveOnSatCache.getFallbackData();
          if (fallbackData) {
            console.log('Using cached LiveOnSat data as fallback');
            return fallbackData;
          }
          return { date: getDate().today(), competitions: [] };
        }
        
        // Wait before retrying
        console.log(`Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  static async scrapeYallaKora() {
    let browser;
    let retries = 4; // Allow 3 attempts total (initial + 2 retries)
    
    while (retries >= 0) {
      try {
        console.log(`Yalla Kora scraping attempt ${2-retries+1}/5`);
        const date = moment().tz('Asia/Riyadh').format('MM/DD/YYYY');
        const urlDate = date.replace(/\//g, '-');
        const url = `https://www.yallakora.com/match-center/?date=${urlDate}`;
        console.log(`Navigating to URL: ${url}`);

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

        console.log('Navigating to page...');
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 80000
        });

        console.log('Waiting for additional dynamic content...');
        await page.waitForTimeout(5000);

        console.log('Checking for matchCard selector...');
        const matchCards = await page.$$('div.matchCard');
        if (matchCards.length === 0) {
          console.log('No matchCard elements found. Checking page content...');
          const pageContent = await page.content();
          if (pageContent.includes('لا توجد مباريات')) {
            console.log('Page indicates no matches are available for this date.');
          } else {
            console.log('matchCard selector might have changed. Inspecting page structure.');
            require('fs').writeFileSync('debug.html', pageContent);
            console.log('Page content saved to debug.html');
          }
          await browser.close().catch(console.error);
          return { date, matches: [] };
        }

        console.log('Evaluating matches...');
        const matches = await page.evaluate((date) => {
          const finishedMatches = [];
          const championships = document.querySelectorAll('div.matchCard');
          console.log(`Found ${championships.length} championships`);

          for (const championship of championships) {
            let championshipTitle;
            try {
              championshipTitle = championship.querySelector('h2')?.textContent.trim() || 'Unknown Championship';
            } catch (e) {
              console.error('Error getting championship title:', e);
              continue;
            }

            const skipKeywords = ['يد', 'طائرة', 'سلة'];
            if (skipKeywords.some(keyword => championshipTitle.includes(keyword))) {
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

        // Convert match_time to Mecca time after evaluation
        const formattedMatches = matches.map(match => ({
          ...match,
          match_time: match.match_time !== 'N/A' ? convertToMeccaTime(match.match_time) : match.match_time
        }));

        console.log(`Yalla Kora scraping completed with ${formattedMatches.length} finished matches`);
        await browser.close().catch(console.error);
        return { date, matches: formattedMatches };
      } catch (error) {
        console.error(`Yalla Kora scraping attempt failed (${2-retries+1}/3):`, error.message);
        if (browser) await browser.close().catch(console.error);
        
        retries--;
        if (retries < 0) {
          console.error('All Yalla Kora scraping attempts failed');
          const fallbackData = await this.yallaKoraCache.getFallbackData();
          if (fallbackData) {
            console.log('Using cached YallaKora data as fallback');
            return fallbackData;
          }
        return { date: moment().tz('Asia/Riyadh').format('MM/DD/YYYY'), matches: [] };
        }
        
        // Wait before retrying
        console.log(`Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

module.exports = ScraperService;