const dotenv = require('dotenv');
dotenv.config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DISC_CLIENT_ID, DISC_BOT_TOKEN } = process.env;

const commands = [
	new SlashCommandBuilder()
        .setName('add-inactive').setDescription('Add an inactivity warning message for this channel')
        .addStringOption(option =>
            option.setName('message').setDescription('Message to send when channel is inactive')
                .setRequired(true).setMaxLength(500)),
    new SlashCommandBuilder()
        .setName('reset-inactive').setDescription('Remove all inactive warnings for this channel'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DISC_BOT_TOKEN);

rest.put(Routes.applicationCommands(DISC_CLIENT_ID), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);