const io = require('socket.io-client');
const axios = require('axios');
const wsToken = '';
const voteLoggerAPI = '';
const voteLoggerWS = '';

module.exports = class Client {
    constructor() {
        this.socket = null;
    }

    async fetchVote(botId, userId) {
        const response = await axios.get(`${voteLoggerAPI}/${botId}/${userId}`)
            .catch(() => {
            });

        if (!response || !response.data || !response.data) {
            return null;
        }

        return response.data;
    }

    connect() {
        this.socket = io(voteLoggerWS, {
            query: {
                token: wsToken
            },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5
        });

        this.socket.on('connect', () => {
            console.info('Connected to premium websocket.');
        });

        this.socket.on('disconnect', (reason) => {
            console.error(`Disconnected from premium websocket. Reason: ${reason}`);
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            console.info(`Reconnect attempt #${attemptNumber}`);
        });

        this.socket.on('reconnect_error', (error) => {
            console.error(`Reconnection error: ${error}`);
        });

        this.socket.on('reconnect_failed', () => {
            console.error('Failed to reconnect to the premium websocket.');
        });

        this.listenToEvents();
    }

    listenToEvents() {
        /*
        * Data is always
        * {
        * botId,
        * userId,
        * voteCount,
        * botList: {
        *      name,
        *      pageLink,
        *      voteCount
        *   }
        * }
        */
        this.socket.on('vote', async (data) => {
            console.log(`[WS] => Received vote from ${data.userId} for ${data.botId}!`);
        });
    }
}
