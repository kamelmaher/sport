const fs = require('fs').promises;
const path = require('path');

class CacheService {
  constructor(cacheFilePath, ttl = 3600000) { // default 1 hour TTL
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
      
      return now - parsed.timestamp < this.ttl ? parsed.data : null;
    } catch (error) {
      console.error('Error reading cache:', error);
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
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }
}

module.exports = CacheService;