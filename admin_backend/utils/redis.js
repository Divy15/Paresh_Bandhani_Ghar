// redis.js
const { createClient } = require('redis');
const config = require('config');

const redisHost = config.get('App.Redis.Host');
const redisPort = config.get('App.Redis.Port');

// Build the standard connection string url Layout
const client = createClient({
    url: `redis://${redisHost}:${redisPort}`
});

client.on('error', (err) => console.error('❌ Redis Client Error:', err));
client.on('connect', () => console.log('🚀 Redis Connected Successfully'));

// Immediately trigger the connection async loop
(async () => {
    await client.connect();
})();

module.exports = client;