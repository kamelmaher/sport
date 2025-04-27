const path = require('path');
const CacheService = require('../../services/cache.service');
const ScraperService = require('../../services/scraper.service');

// Initialize cache services
const liveMatchesCache = new CacheService(
  path.resolve(__dirname, '../../../cache/matches_data.json')
);
const finishedMatchesCache = new CacheService(
  path.resolve(__dirname, '../../../cache/finished_matches_data.json')
);

class MatchesController {
  static async getMatches(req, res) {
    try {
      const cachedData = await liveMatchesCache.get();

      if (cachedData) {
        console.log('Serving LiveOnSat data from cache');
        return res.json(cachedData);
      }

      console.log('No cached LiveOnSat data found, scraping now...');
      const data = await ScraperService.scrapeLiveOnSat();
      await liveMatchesCache.set(data);
      res.json(data);
    } catch (error) {
      console.error('Error in getMatches:', error);
      res.status(500).json({ 
        error: 'Failed to fetch data',
        message: error.message 
      });
    }
  }

  static async getFinishedMatches(req, res) {
    try {
      const cachedData = await finishedMatchesCache.get();

      if (cachedData) {
        console.log('Serving Yalla Kora finished matches from cache');
        return res.json(cachedData);
      }

      console.log('No cached Yalla Kora finished matches found, scraping now...');
      const data = await ScraperService.scrapeYallaKora();
      await finishedMatchesCache.set(data);
      res.json(data);
    } catch (error) {
      console.error('Error in getFinishedMatches:', error);
      res.status(500).json({ 
        error: 'Failed to fetch finished matches',
        message: error.message 
      });
    }
  }

  static async scrapeAndCacheData() {
    const data = await ScraperService.scrapeLiveOnSat();
    await liveMatchesCache.set(data);
    return data;
  }

  static async scrapeYallaKoraFinishedMatches() {
    const data = await ScraperService.scrapeYallaKora();
    await finishedMatchesCache.set(data);
    return data;
  }
}

module.exports = MatchesController;