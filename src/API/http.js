const bots = require('../CONFIGS/bots.json');
const ports = require('../CONFIGS/port.json');
const botLists = require('../CONFIGS/botLists.json');
const allowedIPs = botLists.map(botList => botList.ips).flat();
const getBotList = require('../UTILS/getBotList');
const getUser = require('../UTILS/getUser');

module.exports = () => {
    const app = global.http = require('fastify')({
        logger: false,
        trustProxy: true
    });

    app.post('/:authorization', async (req, res) => {
        const IP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!allowedIPs.includes(IP)) {
            console.log(`[API] => Unauthorized IP tried to access the API! (${IP})`);
            return res.code(403).send({error: 'Forbidden'});
        }

        const authorization = req?.headers?.authorization ?? req?.params?.authorization ?? null;
        if (!authorization) return res.code(400).send({error: 'Bad Request'});

        const bot = bots.find(bot => bot.authToken === authorization);
        if (!bot) return res.code(401).send({error: 'Unauthorized'});

        const botList = getBotList(IP, bot.botId);
        if (!botList) return res.code(403).send({error: 'Forbidden'});

        const user = getUser(req);
        if (!user) return res.code(401).send({error: 'Unauthorized'});

        const oldGlobalCount = await redis.get(`vote-logger:${bot.botId}:${user}:count`);
        if (oldGlobalCount) {
            await redis.set(`vote-logger:${bot.botId}:${user}:count`, Number(oldGlobalCount) + 1);
        } else {
            await redis.set(`vote-logger:${bot.botId}:${user}:count`, 1);
        }

        const oldBotListCount = await redis.get(`vote-logger:${bot.botId}:${user}:${botList.name}:count`);
        if (oldBotListCount) {
            await redis.set(`vote-logger:${bot.botId}:${user}:${botList.name}:count`, Number(oldBotListCount) + 1);
        } else {
            await redis.set(`vote-logger:${bot.botId}:${user}:${botList.name}:count`, 1);
        }

        await redis.set(`vote-logger:${bot.botId}:${user}:voted`, 'true', 'EX', bot.voteCountsFor);

        ws.emit('vote', {
            botId: bot.botId,
            userId: user,
            voteCount: Number(oldGlobalCount) + 1,
            botList: {
                name: botList.name,
                pageLink: botList.pageLink,
                voteCount: Number(oldBotListCount) + 1,
            },
        });
    });

    app.get('/:botId/:userId', async (req, res) => {
        const botId = req?.params?.botId ?? null;
        const userId = req?.params?.userId ?? null;
        if (!botId || !userId) return res.code(400).send({error: 'Bad Request'});

        const bot = bots.find(bot => bot.botId === botId);
        if (!bot) return res.code(404).send({error: 'Not Found'});

        const user = await redis.get(`vote-logger:${bot.botId}:${userId}:voted`);
        const globalCount = await redis.get(`vote-logger:${bot.botId}:${userId}:count`);

        const lists = await Promise.all(botLists.map(async botList => {
            const count = await redis.get(`vote-logger:${bot.botId}:${userId}:${botList.name}:count`);
            return {
                name: botList.name,
                pageLink: botList.pageLink,
                voteCount: count ?? 0,
            };
        }));

        return res.code(200).send({
            voted: user === 'true',
            globalCount: globalCount ?? 0,
            lists,
        });
    });

    app.listen({port: ports.httpPort}, (err, address) => {
        console.log("[API] => API is now listening on port " + ports.httpPort);
    });
};
