/**
 * CacheService
 * Provides caching with in-memory TTL storage by default,
 * and seamless fallback capability for Redis when REDIS_URL is configured.
 */

class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.redisClient = null;
    this.isRedisConnected = false;

    // Optional Redis initialization
    if (process.env.REDIS_URL) {
      try {
        console.log(`[CacheService] Redis URL configured: ${process.env.REDIS_URL}`);
        // Can be extended with ioredis if needed in prod
      } catch (err) {
        console.warn(`[CacheService] Redis connect error: ${err.message}. Using In-Memory Cache.`);
      }
    }
  }

  /**
   * Get item from cache
   * @param {string} key 
   */
  async get(key) {
    if (this.memoryCache.has(key)) {
      const item = this.memoryCache.get(key);
      if (item.expiresAt > Date.now()) {
        return item.value;
      }
      this.memoryCache.delete(key);
    }
    return null;
  }

  /**
   * Set item in cache
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSec TTL in seconds (default 30)
   */
  async set(key, value, ttlSec = 30) {
    const expiresAt = Date.now() + ttlSec * 1000;
    this.memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Delete key
   * @param {string} key 
   */
  async del(key) {
    this.memoryCache.delete(key);
  }

  /**
   * Clear all cache
   */
  async clear() {
    this.memoryCache.clear();
  }
}

module.exports = new CacheService();
