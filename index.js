const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember] });
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require("./config.js");
const { log } = require("./src/helpers/functions.js");
const db = require("quick.db");
const schedule = require('node-schedule');

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(config.token);

const commands = [];
const commandFiles = readdirSync('./src/commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
    log(`Loaded command ${file}`);
}

const eventFiles = readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./src/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
    log(`Loaded event ${file}`);
}

client.on("ready", async () => {
    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
    } catch (error) {
        console.error(error);
    }
    log(`${client.user.username} has been started!`);
})

const blacklist = db.fetch("blacklist")
if (!blacklist) {
    db.set("blacklist", [])
}

client.login(config.token)

schedule.scheduleJob('0 0 * * *', async () => {
    await db.delete("staffs.daily")
});

schedule.scheduleJob('0 0 * * 0', async () => {
    await db.delete("staffs.weekly")
});

schedule.scheduleJob('0 0 1 * *', async () => {
    await db.delete("staffs.monthly")
});
