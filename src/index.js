const websocket = require('./API/ws');
const http = require('./API/http');

const Redis = require('./UTILS/redis');
global.redis = new Redis();

console.log('[VOTE-LOGGER] => Starting websocket server...');
websocket();

console.log('[VOTE-LOGGER] => Starting API server...');
http();
