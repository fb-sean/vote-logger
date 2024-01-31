const ioRedis = require("ioredis");
const {redis: redisConfig} = require("../CONFIGS/auth.json");

module.exports = class Redis {
    constructor() {
        this.ioRedis = new ioRedis(redisConfig);

        this.ioRedis.on('connect', () => {
            console.log('[REDIS] => Connected to redis!');
        });

        this.ioRedis.on('error', err => {
            console.log('[REDIS] => Failed to connect to redis!');
            console.log(err);
        });

        this.ioRedis.on('reconnecting', () => {
            console.log('[REDIS] => Reconnecting to redis...');
        });

        this.ioRedis.on('close', () => {
            console.log('[REDIS] => Connection to redis closed!');
        });
    }

    set(key, value) {
        return this.ioRedis.set(key, value);
    }

    get(key) {
        return this.ioRedis.get(key);
    }

    del(key) {
        return this.ioRedis.del(key);
    }
}
