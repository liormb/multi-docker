const redis = require('redis');
const keys = require('./keys');

function fibonacci(index) {
    if (index < 2) {
        return 1;
    }
    return fibonacci(index - 1) + fibonacci(index - 2);
}

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

redisPublisher.on('message', (channel, message) => {
    redisClient.hset('values', message, fibonacci(parseInt(message)));
});

redisPublisher.subscribe('insert');
