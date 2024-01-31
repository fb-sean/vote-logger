const botLists = require('../CONFIGS/botlists.json');

module.exports = (ip, botId) => {
    const list = botLists.find(list => list.ips.includes(ip));
    if (!list) return null;

    return {
        name: list.name,
        pageLink: list.pageLink + botId,
    };
};
