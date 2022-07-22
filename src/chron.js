const { Client } = require('discord.js');
const phrases = require('./phrases');

const cache = {
    /*
    channelId : {
        lastActivity: number,
        lastWasUs: boolean,
    }
    */
};
module.exports.cache = cache;

// TODO on bot restart check message history for lastActivity

module.exports.track = function track(channelId) {
    cache[channelId] = { lastActivity: Date.now() };
};

module.exports.untrack = function untrack(channelId) {
    delete cache[channelId];
};

let client;
module.exports.enableChron = function enableChron(_client) {
    client = _client;

    const activityTracker = async msg => {
        if (cache[msg.channel.id] && msg.author.id !== client.user.id) {
            cache[msg.channel.id].lastActivity = Date.now();
            cache[msg.channel.id].lastWasUs = false;
        }
    };
    client.on('messageCreate', activityTracker);

    setInterval(module.exports.chron, 5000);
};

module.exports.chron = async function chron() {
    const threshold = 1000 * 60 * 60 * 3; // 3 hours
    const now = Date.now();
    await Promise.all(
        Object.entries(cache).map(
            async ([channelId, { lastActivity, lastWasUs }]) => {
                if (now - lastActivity > threshold && !lastWasUs) {
                    const chan = await client.channels.fetch(channelId);
                    const msg = phrases.pickPhrase(channelId);
                    if (msg)
                        chan.send(msg);
                    cache[channelId].lastWasUs = true;
                    cache[channelId].lastActivity = Date.now();
                }
            }
        )
    );
};