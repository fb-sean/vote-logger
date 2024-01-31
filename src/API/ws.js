const {createServer} = require('http');
const {Server} = require('socket.io');

const httpServer = createServer();
const io = global.ws = new Server(httpServer, {});

const ports = require('../CONFIGS/port.json');
const auth = require('../CONFIGS/auth.json');

module.exports = () => {
    io.use((req, next) => {
        const token = req.handshake.query.token;
        if (!token) return next(new Error('You need to pass a token!'));

        if (auth.wsToken !== token) return next(new Error('Invalid token!'));

        req.token = token;

        next();
    });

    io.on('connection', client => {
        client.on('disconnect', () => {
            console.log('[Websocket] => User disconnected.');
        });

        client.on('ping', () => {
            client.emit('pong');
        });
    });

    httpServer.listen(ports.wsPort);

    console.log("[Websocket] => Websocket is now listening on port " + ports.wsPort);
};
