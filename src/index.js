require('dotenv').config();
const { DISC_BOT_TOKEN } = process.env;

const debug = require('debug')('sexo:bot');

//const db = require('./db');
//db.begin();

// Require the necessary discord.js classes
const { Client, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
// When the client is ready, run this code (only once)
client.once('ready', () => {
	debug('Ready!');
});

const phrases = require('./phrases');
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) {
        debug('unknown ineraction', interaction);
        return;
    }

    const { commandName, channelId } = interaction;
    if (commandName === 'add-inactive') {
        const message = interaction.options.getString('message', true);
        phrases.addPhrase(channelId, message);
        interaction.reply('Message added to list for this channel');
        return;
    }
    if (commandName === 'reset-inactive') {
        delete phrases.cache[channelId];
        phrases.flushChanCache(channelId);
        interaction.reply('Inactivity messages have now been disabled for this channel');
        debug('User reset channel');
        return;
    }

    // TODO update interaction ts's
});

const chron = require('./chron');
chron.enableChron(client);
setImmediate(phrases.loadCache);

// Login to Discord with your client's token
client.login(DISC_BOT_TOKEN);
