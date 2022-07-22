const fs = require('fs');
const debug = require('debug')('sexo:phrases');

const chron = require('./chron');

const cache = {
    // channelId : [ list of phrases to select from ]
}
module.exports.cache = cache;

module.exports.loadCache = function loadCache() {
    const dir = `${process.env.HOME}/.sexo/phrases/`;
    fs.readdirSync(dir).forEach(fname => {
        const channelId = fname.slice(0, -5);
        cache[channelId] = fs.readFileSync(dir + channelId + '.json')
            .toString().split('\n').filter(Boolean).map(JSON.parse.bind(JSON));
        chron.track(channelId);
    });
    debug('loaded %d cache entries', Object.keys(cache).length);
};

module.exports.addPhrase = function addPhrase(channelId, phrase) {
    // Update file
    const p = JSON.stringify(phrase);
    if (!fs.existsSync(`${process.env.HOME}/.sexo/phrases/${channelId}.json`))
        chron.track(channelId);
    fs.appendFileSync(`${process.env.HOME}/.sexo/phrases/${channelId}.json`, p + '\n');

    // Update cache
    if (!cache[channelId]) {
        cache[channelId] = [];
    }
    cache[channelId].push(phrase);

    debug('added phrase for channel %d: %s', channelId, phrase);
};

/**
 * Write cache to disk, overwriting any files
 * @remarks This should only be needed when phrase is removed, deletes db file if empty cache
 */
module.exports.flushChanCache = function flushChanCache(channelId) {
    if (!cache[channelId] || !cache[channelId].length) {
        fs.unlinkSync(`${process.env.HOME}/.sexo/phrases/${channelId}.json`);
        chron.untrack(channelId);
    }

    fs.writeFileSync(
        `${process.env.HOME}/.sexo/phrases/${channelId}.json`,
        cache[channelId].map(JSON.stringify.bind(JSON)).join('\n'));
};

module.exports.pickPhrase = function pickPhrase(channelId) {
    const list = cache[channelId];
    if (!list)
        return;
    return list[Math.floor(Math.random() * list.length)];
};
