const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

/**
 * Connects the Redis client if it is not already connected.
 * Logs a message indicating a successful connection.
 * 
 * @returns {Promise<void>} Resolves when the connection is established.
 * @throws Will log an error if the connection fails.
 */

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log('Connected to Redis');
  }
}

module.exports = {
  client,
  connectRedis,
};
