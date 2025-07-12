const fs = require('fs').promises;
const path = require('path');

class CacheService {
  constructor(cacheFilePath, ttl) {
    this.cacheFilePath = cacheFilePath;
    this.ttl = ttl;
  }

  async ensureCacheDir() {
    const cacheDir = path.dirname(this.cacheFilePath);
    await fs.mkdir(cacheDir, { recursive: true })
      .catch(err => console.error('Error creating cache directory:', err));
  }

  async get() {
    try {
      const cacheData = await fs.readFile(this.cacheFilePath, 'utf-8');
      const parsed = JSON.parse(cacheData);
      const now = Date.now();
      const age = now - parsed.timestamp;

      if (age < this.ttl) {
        console.log(`Serving data from cache (age: ${Math.round(age / 1000)} seconds)`);
        return parsed.data;
      } else {
        console.log(`Cache expired (age: ${Math.round(age / 1000)} seconds, TTL: ${this.ttl / 1000} seconds). Returning last known data.`);
        return parsed.data; // Return last known data even if expired
      }
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }
  async getFallbackData() {
    try {
      const cacheData = await fs.readFile(this.cacheFilePath, 'utf-8');
      const parsed = JSON.parse(cacheData);
      console.log('Retrieving fallback data from cache');
      return parsed.data;
    } catch (error) {
      console.error('Error reading fallback cache:', error);
      return null;
    }
  }

  async set(data) {
    try {
      await this.ensureCacheDir();
      const cacheEntry = {
        timestamp: Date.now(),
        data
      };
      await fs.writeFile(this.cacheFilePath, JSON.stringify(cacheEntry, null, 2));
      console.log('Cache updated successfully');
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }
}

module.exports = CacheService;